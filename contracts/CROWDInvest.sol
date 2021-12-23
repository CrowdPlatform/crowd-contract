// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CROWDInvest is
    Context,
    Ownable //}, CROWDValidator {
{
    address public token_reciever;

    mapping(uint256 => IDOPool) private _investPool;
    mapping(uint256 => address[]) private _whiteListUsers;
    mapping(uint256 => uint256[]) private _whiteListTickets;

    event InvestPool(uint256 indexed invest_id, address invester, uint256 amount, uint256 use_ticket);

    //Don"t accept ETH or BNB
    receive() external payable {
        revert("Don't accept ETH or BNB");
    }

    struct IDOPool {
        uint16 main_per_ticket;
        address main_token;
        uint256 total_amount;
        uint256 invested_amount;
        uint256 ts_start_time;
        uint256 ts_finish_time;
        uint256 state;
    }

    struct WhiteList {
        address user;
        uint256 ticket_amount;
    }

    function registWhiteList(
        uint256 id,
        address[] memory users,
        uint256[] memory amounts
    ) public onlyOwner {
        require(_investPool[id].total_amount != 0, "not exists id.");
        require(users.length == amounts.length, "invalid array counts.");

        require(_investPool[id].ts_start_time > block.timestamp, "registWhiteList: sale started.");

        _whiteListUsers[id] = users;
        _whiteListTickets[id] = amounts;
    }

    function getWhiteList(uint256 id) public view returns (address[] memory, uint256[] memory) {
        return (_whiteListUsers[id], _whiteListTickets[id]);
    }

    function getUserIndex(uint256 id, address addr) internal view returns (int256) {
        for (uint256 i = 0; i < _whiteListUsers[id].length; ++i) {
            if (_whiteListUsers[id][i] == addr) return int256(i);
        }
        return -1;
    }

    function createPool(
        uint256 id,
        uint16 main_per_ticket,
        address main_token,
        uint256 total_amount,
        uint256 ts_start_time,
        uint256 ts_finish_time,
        uint256 state
    ) public onlyOwner {
        require(_investPool[id].total_amount == 0, "createPool: already created id.");
        require(main_per_ticket != 0, "createPool: main_per_ticket is invalid.");
        // require(main_token != address(0), "createPool: main_token is invalid.");
        require(total_amount != 0, "createPool: amount is invalid.");
        require(ts_start_time < ts_finish_time, "createPool: start and finish are invalid.");
        require(ts_start_time > block.timestamp, "createPool: start time is invalid.");

        _investPool[id] = IDOPool(
            main_per_ticket,
            main_token,
            total_amount,
            0, //invested_amount
            ts_start_time,
            ts_finish_time,
            state
        );
    }

    function getPool(uint256 id) public view returns (IDOPool memory) {
        return _investPool[id];
    }

    function updateState(uint256 id, uint256 state) public onlyOwner {
        require(_investPool[id].total_amount != 0x0, "not exists id.");

        _investPool[id].state = state;
    }

    function removePool(uint256 id) public onlyOwner {
        require(_investPool[id].total_amount != 0x0, "not exists id.");
        delete _investPool[id];
        delete _whiteListTickets[id];
        delete _whiteListUsers[id];
    }

    function investPool(uint256 invest_id, uint256 amount) public payable {
        require(_investPool[invest_id].total_amount != 0, "investPool: not exists id.");

        IDOPool storage pool = _investPool[invest_id];
        require(pool.state == 0, "investPool: invalid state.");
        require(pool.invested_amount + amount <= pool.total_amount, "investPool: invest amount is over.");
        require(pool.ts_start_time <= block.timestamp, "investPool: This investment pool has not yet begun.");
        require(pool.ts_finish_time >= block.timestamp, "investPool: This investment pool has already been terminated.");

        require(pool.main_per_ticket != 0, "investPool: main_per_ticket is invalid");
        uint256 use_ticket = amount / 1e18 / uint256(pool.main_per_ticket);
        if (amount % (uint256(pool.main_per_ticket) * 1e18) != 0) use_ticket++;

        int256 idx = getUserIndex(invest_id, msg.sender);
        require(idx != -1 && _whiteListTickets[invest_id][uint256(idx)] >= use_ticket, "investPool: insufficient ticket");

        if (pool.main_token == address(0)) {
            require(amount == msg.value, "investPool: invalid amount");
            payable(token_reciever).transfer(amount);
        } else {
            IERC20 erc20 = IERC20(pool.main_token);
            erc20.transferFrom(msg.sender, token_reciever, amount);
        }
        pool.invested_amount += amount;
        _whiteListTickets[invest_id][uint256(idx)] -= use_ticket;

        emit InvestPool(invest_id, msg.sender, amount, use_ticket);
    }

    function setReciever(address _addr) public onlyOwner {
        token_reciever = _addr;
    }

    function getReciver() public view returns (address) {
        return token_reciever;
    }
}
