// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CROWDValidator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CROWDInvest is Context, Ownable, CROWDValidator{

    // IERC20 _busd;
    
    address token_reciever;

    mapping(uint256 => IDOPool) _investPool;
    mapping(uint256 => address[]) _investPoolUsers;
    mapping(address => mapping(uint256 => uint256)) _users;
    mapping(uint256 => mapping(address => uint256)) _whiteList;

    event InvestPool(uint256 indexed invest_id, address indexed invester, uint256 indexed amount);

    constructor(){
        // _busd = IERC20(address(0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56));//bsc mainnet
        // _busd = IERC20(address(0x86dDC7e76bD30fEA987380f8C5C2bE4a5B43A42C));//bsc testnet 
    }

    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }

    struct IDOPool{
        // address invest_token;
        // uint256 invest_rate;
        uint256 main_per_ticket;

        address main_token;
        uint256 total_amount;
        uint256 invested_amount;

        uint256 ts_start_time;
        uint256 ts_finish_time;
        uint    state;
    }

    struct WhiteList{
        address user;
        uint256 ticket_amount;
    }

    function registWhiteList(uint256 id, address[] memory users, uint256[] memory amounts) public onlyOwner{
        require(_investPool[id].total_amount != 0x0, 'not exists id.');
        require(users.length == amounts.length);
        for(uint i=0; i<users.length; i++){
            _whiteList[id][users[i]] = amounts[i];
        }

    }


    function createPool(
        uint256 id,
        // address invest_token,
        uint256 main_per_ticket,

        address main_token,
        uint256 total_amount,

        uint256 ts_start_time,
        uint256 ts_finish_time,
        uint    state
    ) public onlyOwner{
        require(_investPool[id].total_amount == 0x0, 'already created id.');

        // require(invest_token != address(0));
        require(main_token != address(0));
        require(total_amount != 0);
        require(ts_start_time < ts_finish_time);
        require(ts_finish_time > block.timestamp);

        _investPool[id] = IDOPool(
            // invest_token,
            // invest_rate,
            main_per_ticket,
            main_token,
            total_amount,
            0,
            ts_start_time,
            ts_finish_time,
            state
        );
    }
    function updateState(uint256 id, uint state) public onlyOwner{
        require(_investPool[id].total_amount != 0x0, 'not exists id.');

        _investPool[id].state = state;
    }

    function removePool(uint256 id) public onlyOwner{
        require(_investPool[id].total_amount != 0x0, 'not exists id.');
        delete _investPool[id];
        delete _investPoolUsers[id];
        // delete _users[msg.sender][id];
        // delete _whiteList[id];
    }
    function finishPool(uint256 id) public onlyOwner{

    }

    function investPool(uint256 invest_id, uint256 amount) public{
    // function investPool(uint256 invest_id, uint256 id, address token_address, uint256 amount, uint256 expired_at, bytes memory signature) public{

        require(_investPool[invest_id].total_amount != 0x0, 'not exists id.');
        // verify("investPool", id, msg.sender, amount, token_address, expired_at, getValidator(address(this)), signature);

        IDOPool memory pool = _investPool[invest_id];
        require(pool.ts_start_time > block.timestamp, 'This investment pool has not yet begun.');
        require(pool.ts_finish_time <= block.timestamp, 'This investment pool has already been terminated.');
        
        uint256 use_ticket = amount/ pool.main_per_ticket + 1;
        require(_whiteList[invest_id][msg.sender] > use_ticket, 'insufficient ticket');



        //TODO: check state

        IERC20 erc20 = IERC20(pool.main_token);

        erc20.transferFrom(msg.sender, token_reciever, amount);

        _users[msg.sender][invest_id] += amount;
        _investPoolUsers[invest_id].push(msg.sender);
        _whiteList[invest_id][msg.sender] -= use_ticket;

        emit InvestPool(invest_id, msg.sender, amount);
    }


    // function setBUSD(address _addr) public onlyOwner{
    //     _busd = IERC20(_addr);
    // }

    function setReciever(address _addr) public onlyOwner{
        token_reciever = _addr;
    }

}