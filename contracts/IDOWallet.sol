// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CROWDValidator.sol";

contract IDOWallet is Ownable, CROWDValidator{

    IERC20 ticket;

    //contract address, amount pair
    mapping(address => uint256) private _deposits;

    mapping(uint256 => bool) private _processed;

    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }


    event Deposited(address indexed payee, uint256 weiAmount);

    function depositsOf(address contract_address) public view returns (uint256) {
        return _deposits[contract_address];
    }

    function depositForSale(address contract_address, uint256 amount) public{
        checkValidator(contract_address);
        //TODO: check contract address is erc20
        IERC20 erc20 = IERC20(contract_address);
        erc20.transferFrom(msg.sender, address(this), amount);
        
        _deposits[contract_address] += amount;
        emit Deposited(contract_address, amount);
    }

    function claimIDO(address contract_address, uint256 amount, uint256 id, uint256 expired_at, bytes memory signature) public{
        address _validator = checkValidator(contract_address);

        IERC20 erc20 = IERC20(contract_address);

        uint256 balance = erc20.balanceOf(address(this));
        require(balance >= _deposits[contract_address]);

        require(_deposits[contract_address] >= amount);


        //verify signature
        verify("claimIDO", id, msg.sender, amount, contract_address, expired_at, _validator, signature);

        erc20.transfer(msg.sender, amount);
    }

    function save(address _addr) public onlyOwner{
        IERC20 erc20 = IERC20(_addr);
        uint256 balance = erc20.balanceOf(address(this));
        require(balance > _deposits[_addr]);

        erc20.transfer(owner(), balance - _deposits[_addr]);
    }

    //for ticket
    function depositTicket(uint256 amount) public{
        ticket.transferFrom(msg.sender, address(this), amount);
        //TODO: ticket balance
    }

    function withdrawTicket(uint256 amount, uint256 id, uint256 expired_at, bytes memory signature) public{
        verify("withdrawTicket", id, msg.sender, amount, address(this), expired_at, getValidator(address(this)), signature);
        
        ticket.transfer(msg.sender, amount);
    }

}