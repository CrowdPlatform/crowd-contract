// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ICROWDToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CROWDStaking is Ownable {
    ICROWDToken public crowd;

    uint256 _totalStaking;
    mapping(address => uint256) public stakingBalance;

    event Staking(address indexed user, uint256 amount);
    event Unstaking(address indexed user, uint256 amount);

    //Don't accept ETH or BNB
    receive() external payable {
        revert("Don't accept BNB");
    }

    function setToken(address token_contract) public onlyOwner {
        crowd = ICROWDToken(token_contract);
    }

    function totalStaking() public view returns (uint256) {
        return _totalStaking;
    }

    function stakeTokens(uint256 amount) public {
        crowd.transferFrom(msg.sender, address(this), amount);

        stakingBalance[msg.sender] += amount;
        _totalStaking += amount;

        emit Staking(msg.sender, amount);
    }

    function unstakeTokens(uint256 amount) public {
        require(amount <= stakingBalance[msg.sender], "insufficient balance");
        stakingBalance[msg.sender] -= amount;
        _totalStaking -= amount;
        crowd.transfer(msg.sender, amount);
        emit Unstaking(msg.sender, amount);
    }
}
