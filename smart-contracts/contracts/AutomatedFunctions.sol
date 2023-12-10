// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

import { AutomationCompatibleInterface } from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import { Gateway } from "./IGateway.sol";
import { CCIPHandler } from "./CCIPHandler.sol";

/**
 * @title AutomatedFunctions
 * @notice This contract is responsible for managing upkeeps and functions
 */
contract AutomatedFunctions is FunctionsClient, AutomationCompatibleInterface {
    using FunctionsRequest for FunctionsRequest.Request;

    CCIPHandler ccip;

    struct IntervalToken {
        address receiver;
        uint256 t_index;
        uint256 nLinks;
        uint256 currLink;
        uint256 interval;
        bool onLoop;
        uint256 lastUpdated;
        uint256 activeTill;
    }

    // State variables to store the last request ID, response, and error
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    // Custom error type
    error UnexpectedRequestID(bytes32 requestId);

    // Event to log responses
    event Response(bytes32 indexed requestId, bytes response, bytes err);

    //Callback gas limit
    uint32 gasLimit = 300000;
    bytes32 donId;
    uint64 subscriptionId;

    IntervalToken[] private intervalTokens;
    address immutable owner;
    address private cgContract;
    string private source;
    /**
     * @notice Initializes the contract with the Chainlink router address and sets the contract owner
     */
    constructor(
        address router,
        bytes32 _donID,
        uint64 _subscriptionId
    ) FunctionsClient(router){
        donId = _donID;
        subscriptionId = _subscriptionId;
        owner = msg.sender;
    }
    
    function addToken(IntervalToken memory token) public {
        require(msg.sender == cgContract);
        intervalTokens.push(token);
    }

    function checkUpkeep(bytes memory) external view returns (bool , bytes memory ) {
        IntervalToken[] memory tokens = intervalTokens;
        uint32 t_length = uint32(tokens.length);
        for (uint32 i = 0; i < t_length; i++) {
            IntervalToken memory token = tokens[i];
            if (
                ((block.timestamp - token.lastUpdated) > token.interval) 
                && 
                ((token.activeTill - block.timestamp) > 0)
            ) {
                return (true, abi.encode(token.receiver, token.t_index, i));
            }
        }
        return (false, "");
    }

    
    function performUpkeep(bytes calldata performData) external {
        (address currContract, uint256 currTokenId, uint32 i) = abi.decode(
            performData,
            (address, uint256, uint32)
        );
        IntervalToken memory token = intervalTokens[i];
        require((
            ((block.timestamp - token.lastUpdated) > token.interval) 
            && 
            ((token.activeTill - block.timestamp) > 0)
        ),"Upkeep not needed");
        intervalTokens[i].currLink++;
        intervalTokens[i].lastUpdated = block.timestamp;
        token.currLink++;
        if ((token.currLink+1 <= token.nLinks) || (token.onLoop)) {
            bytes[] memory bytesArgs = new bytes[](1);
            bytesArgs[0] = (abi.encodeWithSelector(Gateway.updateToken.selector, abi.encodeWithSelector(Gateway.updateToken.selector, msg.sender, currContract, currTokenId)));
            sendRequest(bytesArgs);
        }
    }

    /**
     * @notice Sends an HTTP request for character information
     * @param bytesArgs The arguments to pass to the HTTP request
     * @return requestId The ID of the request
     */
    function sendRequest(
        bytes[] memory bytesArgs
    ) public returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donId
        );

        return s_lastRequestId;
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        // Update the contract's state variables with the response and any errors
        s_lastResponse = response;
        s_lastError = err;
        (address tokenOwner, address receiver, uint256 tokenIndex, string memory link, uint256 destinationChainSelector) = abi.decode(response, (address, address, uint256, string, uint256 ));
        ccip.sendMessage(receiver, abi.encode(link, tokenOwner, tokenIndex, 2), destinationChainSelector);
        // Emit an event to log the response
        emit Response(requestId, s_lastResponse, s_lastError);
    }

    function setSource(string memory _source) external  {
        require(msg.sender == owner);
        source = _source;
    }

    function setCCIP(address _ccip) external {
        require(msg.sender == owner);
        ccip = CCIPHandler(_ccip);
    }

    function setCGContract(address _cgContract) external {
        require(msg.sender == owner);
        cgContract = _cgContract;
    }

}