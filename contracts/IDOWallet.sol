// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IDOWallet is Ownable{
    using ECDSA for bytes32;

    // address _validator;

    mapping(address => address) private _validators;

    //contract address, amount pair
    mapping(address => uint256) private _deposits;

    mapping(uint256 => bool) private _processed;

    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }


    function setValidator(address _addr, address _validator) public onlyOwner{
        _validators[_addr] = _validator;
    }
    function getValidator(address _addr) public view returns (address){
        return _validators[_addr];
    }


    event Deposited(address indexed payee, uint256 weiAmount);

    function depositsOf(address contract_address) public view returns (uint256) {
        return _deposits[contract_address];
    }

    function checkValidator(address _addr) private view returns (address){
        address _validator = getValidator(_addr);
        require(_validator != address(0), "validator is not set.");
        return _validator;
    }

    function depositForSale(address contract_address, uint256 amount) public{
        checkValidator(contract_address);
        //TODO: check contract address is erc20
        IERC20 erc20 = IERC20(contract_address);
        erc20.transferFrom(msg.sender, address(this), amount);
        
        _deposits[contract_address] += amount;
        emit Deposited(contract_address, amount);
    }

    function withdraw(address contract_address, uint256 amount, uint256 id, bytes memory signature) public{
        require(_processed[id] == false);
        address _validator = checkValidator(contract_address);

        IERC20 erc20 = IERC20(contract_address);

        uint256 balance = erc20.balanceOf(address(this));
        require(balance >= _deposits[contract_address]);

        require(_deposits[contract_address] >= amount);


        //TODO: verify signature
        bytes32 _hash = keccak256(
        abi.encodePacked(
            "withdrawERC20",
            id,
            msg.sender,
            contract_address,
            amount
        )
        );        
        address signer = _hash.recover(signature);

        require(signer == _validator, "invalid signer");

        erc20.transfer(msg.sender, amount);

        _processed[id] = true;
    }

    function save(address _addr) public onlyOwner{
        IERC20 erc20 = IERC20(_addr);
        uint256 balance = erc20.balanceOf(address(this));
        require(balance > _deposits[_addr]);

        erc20.transfer(owner(), balance - _deposits[_addr]);
    }
}