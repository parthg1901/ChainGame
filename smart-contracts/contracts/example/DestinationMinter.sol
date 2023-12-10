// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {CGT} from "./CGT.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract DestinationMinter is CCIPReceiver {
    CGT nft;
    address private cgContract;
    uint64 private cgChain;
    address immutable c_link;

    event MintCallSuccessfull();
    event MessageSent();

    mapping(uint256 => uint256) indexToToken;
    mapping(uint256 => uint256) tokenToIndex;
    /**
     * @param router Chainlink CCIP router address for your contract chain
     * @param nftAddress Contract address of your contract which mints the NFT
     * @param link Link token address for your current chain 
     */
    constructor(address router, address nftAddress, address link) CCIPReceiver(router) payable {
        nft = CGT(nftAddress);
        c_link = link;
        LinkTokenInterface(c_link).approve(router, type(uint256).max);
    }
    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (string memory value, address add, uint256 token , uint256 typeTxn) = abi.decode(message.data, (string, address, uint256, uint256));
        // typeTxn = 1 implies that new token should be minted
        // typeTxn = 2 implies that existing token is updated 
        if (typeTxn == 1) {
            uint256 tokenId = nft.mint(add, value);
            // Here, index is the index of the token in the cloudflare gateway
            // And tokenId is the actual token id of the ERC720 token
            tokenToIndex[tokenId] = token;
            indexToToken[token] = tokenId;
        } else if (typeTxn == 2) {
            nft.setTokenURI(indexToToken[token], value);
        }

        emit MintCallSuccessfull();
    }

    //NEEDED ONLY IF YOU WANT TO IMPLEMENT LEVEL BASED NFTS

    function upgradeTokenLevel(uint256 tokenId) public {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(cgContract),
            data: abi.encode(tokenToIndex[tokenId]),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                // Additional arguments, setting gas limit and non-strict sequencing mode
                Client.EVMExtraArgsV1({gasLimit: 800_000})
            ),
            feeToken: c_link
        });
        bytes32 messageId;

        messageId = IRouterClient(this.getRouter()).ccipSend(
            cgChain,
            message
        );
        emit MessageSent();
    }
    /*
    * @notice Use this function only if you want level-based nfts. And make sure to add necessary checks
    * @param _cgContract Contract address of the Chaingame contract
    * @param _cgChain Destination Chain Selector for Chaingame Contract
    */
    function setCG(address _cgContract, uint64 _cgChain) external {
        cgContract = _cgContract;
        cgChain = _cgChain;
    }
}