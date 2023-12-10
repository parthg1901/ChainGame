// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

import { AutomatedFunctions } from "./AutomatedFunctions.sol";

contract CCIPHandler is CCIPReceiver {

    AutomatedFunctions functions;

    struct LevelToken {
        address owner;
        address receiver;
        uint256 t_index;
        uint256 currLink;
        uint256 nLinks;
    }

    address immutable c_router;
    address immutable c_link;
    address immutable owner;
    address private cgContract;

    uint64[] internal destChains = [
        16015286601757825753,
        2664363617261496610,
        12532609583862916517,
        14767482510784806043,
        13264668187771770619,
        5790810961207155433
    ];
    mapping (address => mapping (uint256 => LevelToken)) private levelTokens;

    constructor(address router, address link) CCIPReceiver(router) payable {
        c_router = router;
        c_link = link;
        owner = msg.sender;
        
        LinkTokenInterface(c_link).approve(router, type(uint256).max);
    }

    function addToken(LevelToken memory token, address receiver, uint256 t_index) external {
        require(msg.sender == cgContract);
        levelTokens[receiver][t_index] = token;
    }

    function sendMessage(address receiver, bytes memory data, uint256 destinationChainSelector) external returns (bytes32 messageId){
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                // Additional arguments, setting gas limit and non-strict sequencing mode
                Client.EVMExtraArgsV1({gasLimit: 800_000})
            ),
            feeToken: c_link
        });

        messageId = IRouterClient(c_router).ccipSend(
            destChains[destinationChainSelector],
            message
        );
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override  {
        (uint256 token) = abi.decode(message.data, (uint256));
        (address sender) = abi.decode(message.sender, (address));
        
        LevelToken memory currToken = levelTokens[sender][token];
        require(currToken.currLink+1 < currToken.nLinks, "Already max level");
        levelTokens[sender][token].currLink++;
        currToken.currLink++;
    }

    function setContract(address _cgContract) external {
        require(msg.sender == owner);
        cgContract = _cgContract;
    }

    function setFunctions(address fnContract) external {
        require(msg.sender == owner);
        functions = AutomatedFunctions(fnContract);
    }

}