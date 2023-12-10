// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import { Withdraw } from "./utils/Withdraw.sol";
import { AutomatedFunctions } from "./AutomatedFunctions.sol";
import { CCIPHandler } from "./CCIPHandler.sol"; 
import { Gateway } from "./IGateway.sol";

error OffchainLookup(address sender, string[] urls, bytes callData, bytes4 callbackFunction, bytes extraData);

contract Chaingame is Withdraw {
    using ECDSA for bytes32;

    AutomatedFunctions functions;
    CCIPHandler ccip;

    enum TokenType {
        Static,
        Level,
        Interval
    }
    uint256[3] public prices;

    mapping (address => uint256) private contractBalance;
    mapping (address => mapping(uint256 => uint256)) public tokenPrices;
    string[] private urls;
    address immutable signer;
    address immutable ownerAddress;

    constructor(uint256[3] memory _prices, string[] memory _urls, address _signer) payable {
        prices = _prices;
        urls = _urls;
        signer = _signer;
        ownerAddress = msg.sender;
    }

    receive() external payable {}

    function checkPrice(TokenType tokenType, uint256 duration, uint256 interval, uint256 nLinks) public view returns(uint256) {
        if (tokenType == TokenType.Static) {
            return prices[uint8(tokenType)];
        } else if (tokenType == TokenType.Interval) {
            return prices[uint8(tokenType)]*(duration/interval);
        } else {
            return prices[uint8(tokenType)]*nLinks;
        }
    }

    function createToken(uint256 destinationChainSelector, address receiver, TokenType tokenType, uint256 interval, bool onLoop, string[] memory links, uint256 price, uint256 duration) external payable {
        require(msg.value >= checkPrice(tokenType, duration, interval, links.length), "Amount not enough");
        revert OffchainLookup(
            address(this),
            urls,
            abi.encodeWithSelector(Gateway.createToken.selector, destinationChainSelector, receiver, tokenType, interval, onLoop, links, price, duration),   
            Chaingame.createTokenWithSignature.selector,
            abi.encode(receiver, price, tokenType, duration, interval, links.length)
        );
    }

    function createTokenWithSignature(bytes calldata result, bytes calldata extraData) external payable {
        (uint256 t_index, bytes memory sig) = abi.decode(result, (uint256, bytes));
        (address receiver, uint256 price, TokenType tokenType, uint256 duration, uint256 interval, uint256 nLinks) = abi.decode(extraData, (address, uint256, TokenType, uint256, uint256, uint256));
        require(msg.value >= checkPrice(tokenType, duration, interval, nLinks), "Amount not enough");

        address recovered = keccak256(
        abi.encodePacked("\x19Ethereum Signed Message:\n32",
            keccak256(abi.encodePacked(receiver, t_index))
        )).recover(sig);
        require(signer == recovered);
        tokenPrices[receiver][t_index] = price;
    }
    
    function buy(
        address receiver,
        uint256 tokenIndex
    ) external payable{
        require(msg.value >= tokenPrices[receiver][tokenIndex], "Amount not enough");
        revert OffchainLookup(
            address(this),
            urls,
            abi.encodeWithSelector(Gateway.buyToken.selector, msg.sender, receiver, tokenIndex),
            Chaingame.buyWithSignature.selector,
            abi.encode(receiver, tokenIndex)
        );
    }

    function buyWithSignature(bytes calldata result, bytes calldata extraData) external payable {
        (address receiver, uint256 t_index) = abi.decode(extraData, (address, uint256));
        require(msg.value >= tokenPrices[receiver][t_index], "Amount not enough");
        (uint256 destinationChainSelector, string[] memory links, bool onLoop, uint256 activeTill, uint256 index, bytes memory sig, TokenType tokenType, uint256 interval) = abi.decode(result, (uint256, string[], bool, uint256, uint256, bytes, TokenType, uint256));
        address recovered = keccak256(
        abi.encodePacked("\x19Ethereum Signed Message:\n32",
            keccak256(abi.encodePacked(receiver, index))
        )).recover(sig);
        require(signer == recovered);
        if (tokenType == TokenType.Interval) {
            AutomatedFunctions.IntervalToken memory token = AutomatedFunctions.IntervalToken(
                receiver,
                index,
                links.length,
                0,
                interval,
                onLoop,
                block.timestamp,
                activeTill
            );
            functions.addToken(token);
        } else if (tokenType == TokenType.Level) {
            CCIPHandler.LevelToken memory token = CCIPHandler.LevelToken(
                msg.sender,
                receiver,
                index,
                0,
                links.length
            );
            ccip.addToken(token, receiver, index);
        }
        ccip.sendMessage(receiver, abi.encode(links[0], msg.sender, index, 1), destinationChainSelector);
        contractBalance[receiver] += tokenPrices[receiver][t_index];
    }

    function setContracts(address _functions, address _ccip) external {
        require(msg.sender == ownerAddress);
        functions = AutomatedFunctions(_functions);
        ccip = CCIPHandler(_ccip);
    }

    function getBalance(address receiver) external view returns (uint256){
        return contractBalance[receiver];
    }

}