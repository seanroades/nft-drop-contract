// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FantasyIslands is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private numberOfIslands;
    address payable public _owner;
    uint public MAX_ISLANDS = 100;
    bool public saleActive = false;
    uint[] public certificates;

    constructor() ERC721("Republic Realm's Fantasy Islands", "RRFI") {
        _owner = payable(msg.sender);
    }

    function changeSaleStatus(bool _status) public onlyOwner {
        saleActive = _status;
    }

    function changeContractOwner(address newOwner) public {
        transferOwnership(newOwner);
    }

    function mintCertificate() public payable returns (uint256) {
        require(saleActive == true, 'Sale is not currently active');
        require(msg.value == 3.14 ether, 'Requires 3.14 ether to mint');
        require(totalSupply() <= MAX_ISLANDS, 'All islands are already minted');
        numberOfIslands.increment();
        uint256 newCertifcateID = numberOfIslands.current();
        certificates.push(newCertifcateID);
        _mint(msg.sender, newCertifcateID);
        // TODO Metadata
        _owner.transfer(msg.value);
        return newCertifcateID;
    }
}
