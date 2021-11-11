// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


//토큰 주소 등록 : eth -> bsc, bsc -> eth


contract CrowdBridge is Ownable{    
    uint network_type;
    constructor(uint network){
        network_type = network;
    }

    mapping(address => address) _mapEthBsc;

    receive () payable external{
        revert();
    }

    function resigtryMapEthBsc(address from_address, address to_address) public onlyOwner{
        IERC20 erc20 = IERC20(from_address);
        _mapEthBsc[from_address] = to_address;
    }

    // event LogTransferToNetwork(address indexed to_account, uint256 amount, string to_network);
    // event LogTransferFromNetwork(string from_network, bytes32 indexed txhash, address indexed to_account, uint256 indexed amount);

    //
    function transferToNetwork(address contract_address, address to_account, uint256 amount, string memory to_network) public {
        require(_mapEthBsc[contract_address] != address(0));
        IERC20 erc20 = IERC20(contract_address);
        erc20.burn(amount);

        // emit LogTransferToNetwork(to_account, amount, to_network);

    }

    function confirm(address contract_address, string memory from_network, bytes32 txhash, address account, uint256 amount, bytes signature) public {
        require(_mapEthBsc[contract_address] != address(0));
        IERC20 erc20 = IERC20(contract_address);
        erc20._mint(account, amount);

        // emit LogTransferFromNetwork(from_network, txhash, account, amount);
    }
}
