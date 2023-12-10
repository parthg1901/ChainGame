// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CGT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenId;

    constructor(address _owner) ERC721("CGT Sample Token", "CGT") Ownable(_owner) {}

    function mint(address to, string memory _URI) public onlyOwner returns(uint256){
        _safeMint(to, tokenId.current());
        _setTokenURI(tokenId.current(), _URI);
        uint256 _tokenId = tokenId.current();
        unchecked {
            tokenId.increment();
        }
        return _tokenId;
    }

    function setTokenURI(
        uint256 token,
        string memory TOKEN_URI
    ) public onlyOwner{
        _setTokenURI(token, TOKEN_URI);
    }
}