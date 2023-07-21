// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyNFT is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter private _tokenIds;
    Counters.Counter private _tokensOnSaleCount;

    mapping(address => EnumerableSet.UintSet) private _ownedTokens;
    mapping(uint256 => uint256) private _tokenPrice;
    mapping (uint256 => string) private _tokenURIs;

    struct NFTData {
        string name;
        string description;
        string trait1;
        string trait2;
        string trait3;
    }

    mapping(uint256 => NFTData) private _tokenData;

    constructor() ERC721("Art-Hunters-V0.2", "ATHS") {}

    function mintNFT(address recipient, string memory uri, NFTData memory data) public returns (uint256) {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, uri); // Changed the parameter name here
    _tokenData[newItemId] = data;
    _ownedTokens[recipient].add(newItemId);

    return newItemId;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint256 i = 0; i < tokenCount; i++){
            tokensId[i] = ERC721Enumerable.tokenOfOwnerByIndex(owner, i);
        }
        return tokensId;
    }

    function allTokensOnSale() public view returns (uint256[] memory) {
        uint256 totalTokens = _tokenIds.current();
        uint256 saleTokens = _tokensOnSaleCount.current();
        uint256[] memory tokensOnSale = new uint256[](saleTokens);
        uint256 index = 0;

        for(uint256 i = 0; i < totalTokens; i++) {
            if(_tokenPrice[i] > 0) {
                tokensOnSale[index] = i;
                index++;
            }
        }
        return tokensOnSale;
    }

    function setForSale(uint256 tokenId, uint256 price) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        if(_tokenPrice[tokenId] == 0 && price > 0){
            _tokensOnSaleCount.increment();
        } else if (_tokenPrice[tokenId] > 0 && price == 0) {
            _tokensOnSaleCount.decrement();
        }
        _tokenPrice[tokenId] = price;
    }

    function removeFromSale(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        if (_tokenPrice[tokenId] > 0) {
            _tokenPrice[tokenId] = 0;
            _tokensOnSaleCount.decrement();
        }
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrice[tokenId];
    }

    function buyToken(uint256 tokenId) public payable nonReentrant {
        uint256 askingPrice = _tokenPrice[tokenId];
        require(msg.value >= askingPrice, "Price not met");
        address owner = ownerOf(tokenId);
        payable(owner).transfer(msg.value);
        _transfer(owner, _msgSender(), tokenId);
        _tokenPrice[tokenId] = 0;
        _tokensOnSaleCount.decrement();
    }
}
