// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CROWDValidator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CROWDInvest is Context, Ownable, CROWDValidator{

    // IERC20 _busd;
    
    address token_reciever;

    constructor(){
        // _busd = IERC20(address(0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56));//bsc mainnet
        // _busd = IERC20(address(0x86dDC7e76bD30fEA987380f8C5C2bE4a5B43A42C));//bsc testnet 
    }

    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }

    mapping(uint256 => IDOPool) investPool;
    mapping(address => mapping(uint256 => uint256)) users;

    struct IDOPool{
        address invest_token;
        uint256 invest_rate;

        address main_token;
        uint256 total_amount;
        uint256 invested_amount;

        uint256 ts_start_time;
        uint256 ts_finish_time;
    }


    function createPool(
        uint256 id,
        address invest_token,
        uint256 invest_rate,

        address main_token,
        uint256 total_amount,

        uint256 ts_start_time,
        uint256 ts_finish_time  
    ) public onlyOwner{
        require(investPool[id].total_amount == 0x0, 'already created id.');

        require(invest_token != address(0));
        require(main_token != address(0));
        require(total_amount != 0);
        require(ts_start_time < ts_finish_time);
        require(ts_finish_time > block.timestamp);

        investPool[id] = IDOPool(
            invest_token,
            invest_rate,
            main_token,
            total_amount,
            0,
            ts_start_time,
            ts_finish_time
        );
    }

    function removePool(uint256 id) public onlyOwner{

    }
    function finishPool(uint256 id) public onlyOwner{

    }

    function investBUSD(uint256 invest_id, uint256 id, address token_address, uint256 amount, uint256 expired_at, bytes memory signature) public{

        verify("investBUSD", id, msg.sender, amount, token_address, expired_at, getValidator(address(this)), signature);

        IDOPool memory pool = investPool[invest_id];
        require(pool.ts_start_time > block.timestamp, 'This investment pool has not yet begun.');
        require(pool.ts_finish_time <= block.timestamp, 'This investment pool has already been terminated.');

        IERC20 erc20 = IERC20(pool.main_token);

        erc20.transferFrom(msg.sender, token_reciever, amount);

        users[msg.sender][invest_id] += amount;
    }




    // function setBUSD(address _addr) public onlyOwner{
    //     _busd = IERC20(_addr);
    // }

    function setReciever(address _addr) public onlyOwner{
        token_reciever = _addr;
    }

}