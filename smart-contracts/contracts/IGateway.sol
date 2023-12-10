// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

enum TokenType {
    Static,
    Level,
    Interval
}

interface Gateway {
    function createToken(uint256 destinationChainSelector, address receiver, TokenType tokenType, uint256 interval, bool onLoop, string[] memory links, uint256 price, uint256 duration) external view returns(uint256 t_index, bytes memory sig);
    function buyToken(address owner, address receiver, uint256 t_index) external view returns (uint256 destinationChainSelector, string[] memory links, bool onLoop, uint256 activeTill, uint256 index, bytes memory sig, TokenType tokenType, uint256 interval);
    function updateToken(address sender, address currContract, uint256 currTokenIndex) external view returns (address owner, address receiver, uint256 index, string memory link, uint256 destinationChainSelector);
}