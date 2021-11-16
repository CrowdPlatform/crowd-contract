// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "./ICROWDToken.sol";

contract CROWDStaking is Context{
    string public name = "CROWD Staking";
    address public owner;

    ICROWDToken public crowd;

    uint256 _totalStaking;
    mapping(address =>uint256) public stakingBalance;

    event Staking(address indexed user, uint256 amount);
    event Unstaking(address indexed user, uint256 amount);

    constructor(ICROWDToken _crowd){
        crowd = _crowd;
    }
    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }

    function totalStaking() public view returns (uint256){
        return _totalStaking;
    }

    function getStaking(address addr) public view returns (uint256){
        return stakingBalance[addr];
    }

    function stakeTokens(uint256 amount) public{
        crowd.transferFrom(_msgSender(), address(this), amount);

        stakingBalance[_msgSender()] += amount;
        _totalStaking += amount;

        emit Staking(_msgSender(), amount);
    }

    function unstakeTokens(uint256 amount) public{
        require(amount >= stakingBalance[_msgSender()]);
        crowd.transfer(_msgSender(), amount);
        stakingBalance[_msgSender()] -= amount;
        _totalStaking -= amount;
        emit Unstaking(_msgSender(), amount);
    }
}
