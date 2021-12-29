// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ICROWDToken.sol";

contract CROWDTokenBSC is ICROWDToken {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _amount,
        uint256 _maxSupply
    ) ERC20(_name, _symbol) {
        setMaxSupply(_maxSupply * 10**decimals());
        _mint(_msgSender(), _amount * 10**decimals());
    }

    //Don't accept ETH or BNB
    receive() external payable {
        revert("Don't accept ETH or BNB");
    }
}
