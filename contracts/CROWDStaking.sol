// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ICROWDToken.sol";

contract CROWDStaking{
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
        crowd.transferFrom(msg.sender, address(this), amount);

        stakingBalance[msg.sender] += amount;
        _totalStaking += amount;

        emit Staking(msg.sender, amount);
    }

    function unstakeTokens(uint256 amount) public{
        require(amount <= stakingBalance[msg.sender], 'insufficient balance');
        crowd.transfer(msg.sender, amount);
        stakingBalance[msg.sender] -= amount;
        _totalStaking -= amount;
        emit Unstaking(msg.sender, amount);
    }
}
