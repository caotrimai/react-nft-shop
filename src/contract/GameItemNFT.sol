// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract GameItem is ERC721Enumerable {
    uint tokenId;
    mapping(uint => string) _tokenURI;

    constructor() ERC721("Game Item NFT", "GIN"){
        tokenId = 1;
    }

    function mint(string memory __tokenURI) public{
        _tokenURI[tokenId] = __tokenURI;
        _mint(msg.sender, tokenId);
        tokenId++;
    }

    function tokenURI(uint _tokenId) public view override returns(string memory){
        return _tokenURI[_tokenId];
    }
}