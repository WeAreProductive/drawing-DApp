// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DrawingNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("DrawingNFT", "NFT") {}

  function mint(address recipient, string memory tokenURI) public returns (uint256) {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, tokenURI);

    return newItemId;
  }
}