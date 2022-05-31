// SPDX-License-Identifier: MIT
// follow: https://github.com/DanielMoralisSamples/25_NFT_MARKET_PLACE/blob/master/contracts/market_place.sol
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT_MARKET {
    struct Selling {
        bytes32 sellingId;
        address seller;
        address nftAddress;
        uint tokenId;
        uint price; // wei BNB
        bool closed;
    }

    bytes32[] sellingIdList;
    mapping(address => bytes32[]) public sellingNft;
    mapping(bytes32 => Selling) public sellingRegistry;
    address public owner;
    uint public constant MIN_PRICE = 1000; // 1000 wei
    uint public constant ACTUALLY_RECEIVED = 90; // 90%


    constructor(){
        owner = msg.sender;
    }

    event SellingPlace(bytes32 indexed sellingId, address nftAddress, address seller, uint tokenId, uint price, string uri);
    event SellingClose(bytes32 indexed sellingId, address buyer);

    modifier checkOwner(){
        require(owner == msg.sender, "Sorry, you are not owner");
        _;
    }

    modifier checkBalance(){
        require(address(this).balance > 0, "Sorry, the balance of market is not enough");
        _;
    }

    function changeOwner(address _newOwner) public checkOwner{
        owner = _newOwner;
    }

    struct SellingIndex{
        uint index;
        bool found;
    }

    function findIndexSellingId(bytes32 element) internal view returns(SellingIndex memory) {
        for (uint i = 0 ; i < sellingIdList.length; i++) {
            if (element == sellingIdList[i]) {
                return SellingIndex(i, true);
            }
        }
        return SellingIndex(0, false);
    }

    // Move the last element to the deleted spot.
    // Remove the last element.
    function sellingIdListRemove(uint index) internal {
        require(index < sellingIdList.length);
        sellingIdList[index] = sellingIdList[sellingIdList.length-1];
        sellingIdList.pop();
    }

    function sellNFT(address _nftAddress, uint _tokenId, uint _price) external{
        ERC721 nft = ERC721(_nftAddress);
        require(nft.getApproved(_tokenId) == address(this), "Sorry, please approve permission");
        require(_price >= MIN_PRICE, "Sorry, the price is not enough");
        bytes32 sellingId = keccak256(abi.encodePacked(msg.sender, _nftAddress, _tokenId));
        require(sellingRegistry[sellingId].price == 0 || (sellingRegistry[sellingId].price > 0 && sellingRegistry[sellingId].closed == true), "Sorry, you have already posted this item for sale");
        sellingRegistry[sellingId].sellingId = sellingId;
        sellingRegistry[sellingId].seller = msg.sender;
        sellingRegistry[sellingId].nftAddress = _nftAddress;
        sellingRegistry[sellingId].tokenId = _tokenId;
        sellingRegistry[sellingId].price = _price;
        sellingRegistry[sellingId].closed = false;
        sellingNft[_nftAddress].push(sellingId);
        sellingIdList.push(sellingId);
        string memory uri = nft.tokenURI(_tokenId);
        emit SellingPlace(sellingId, _nftAddress, msg.sender, _tokenId, _price, uri);
    }

    function buyNFT(bytes32 _sellingId) external payable{
        SellingIndex memory sellingIndex = findIndexSellingId(_sellingId);
        require(sellingIndex.found == true, "Sorry, this item is not exist");
        require(sellingRegistry[_sellingId].price >= MIN_PRICE, "Sorry, this item is not exist");
        require(sellingRegistry[_sellingId].closed == false, "Sorry, this item is closed");
        require(msg.value >= sellingRegistry[_sellingId].price, "Sorry, you don't have enough money");
        ERC721 nft = ERC721(sellingRegistry[_sellingId].nftAddress);
        nft.safeTransferFrom(sellingRegistry[_sellingId].seller, msg.sender, sellingRegistry[_sellingId].tokenId);
        sellingRegistry[_sellingId].closed = true;


        sellingIdListRemove(sellingIndex.index);

        payable(sellingRegistry[_sellingId].seller).transfer(sellingRegistry[_sellingId].price*ACTUALLY_RECEIVED/100);
        emit SellingClose(_sellingId, msg.sender);
    }

    function withdraw() external checkOwner checkBalance{
        payable(owner).transfer(address(this).balance);
    }

    function withdraw(uint amount) external checkOwner checkBalance{
        require(address(this).balance >= amount, "Sorry, the balance of market is not enough");
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

    function getSellingDetail(bytes32 _sellingId) public view returns(bytes32, address, uint, uint, bool){
        return (sellingRegistry[_sellingId].sellingId,
        sellingRegistry[_sellingId].nftAddress,
        sellingRegistry[_sellingId].tokenId,
        sellingRegistry[_sellingId].price,
        sellingRegistry[_sellingId].closed);
    }

    function getAllSellingItems() public view returns(Selling[] memory){
        Selling[] memory result = new Selling[](sellingIdList.length);
        for(uint i=0; i<sellingIdList.length; i++){
            if(sellingRegistry[sellingIdList[i]].closed == false){
                Selling storage selling = sellingRegistry[sellingIdList[i]];
                result[i] = selling;
            }
        }
        return result;
    }

}
