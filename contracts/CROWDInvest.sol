// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CROWDValidator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CROWDInvest is Context, Ownable, CROWDValidator{

    IERC20 _busd;
    address token_reciever;
    function setReciever(address _addr) public onlyOwner{
        token_reciever = _addr;
    }
    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }

    struct IDOPool{
        address sale_token;
        uint256 sale_amount;

        address main_token;
        uint256 total_amount;
        uint256 current_amount;

        uint256 ts_start_sale;
        uint256 ts_finish_sale;

        mapping(address => uint256) users;
    }

    function setBUSD(address _addr) public onlyOwner{
        _busd = IERC20(_addr);
    }

    function registPool() public onlyOwner{

    }

    function unregistPool(uint256 id) public onlyOwner{

    }

    function investBUSD(uint256 id, address token_address, uint256 amount, uint256 expired_at, bytes memory signature) public{

        verify("investBUSD", id, msg.sender, amount, token_address, expired_at, getValidator(address(this)), signature);

        _busd.transferFrom(msg.sender, token_reciever, amount);
    }

}