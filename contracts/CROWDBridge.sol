// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CROWDValidator.sol";
import "./ICROWDToken.sol";

contract CrowdBridge is Ownable, CROWDValidator{    

    mapping(address => address) _mapEthBsc;

    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }

    function resigtryMapEthBsc(address from_address, address to_address) public onlyOwner{
        require(isContract(from_address) == true);
        _mapEthBsc[from_address] = to_address;
    }

    event LogTransferToNetwork(address indexed to_account, uint256 amount, string to_network);
    event LogTransferFromNetwork(string from_network, bytes32 indexed txhash, address indexed to_account, uint256 indexed amount);

    function transferToNetwork(address contract_address, address to_account, uint256 amount, string memory to_network) public {
        require(_mapEthBsc[contract_address] != address(0));
        
        ICROWDToken(contract_address).burnFrom(msg.sender, amount);

        emit LogTransferToNetwork(to_account, amount, to_network);
    }

    function transferFromNetwork(
        address contract_address, 
        uint256 id, 
        string memory from_network, 
        bytes32 txhash, 
        uint256 amount, 
        uint256 expired_at, 
        bytes memory signature) public {
       
        require(_mapEthBsc[contract_address] != address(0));

        //verify signature
        verify("transferFromNetwork", id, msg.sender, amount, contract_address, expired_at, getValidator(contract_address), signature);
        
        ICROWDToken(contract_address).mint(msg.sender, amount);

        emit LogTransferFromNetwork(from_network, txhash, msg.sender, amount);
    }
}