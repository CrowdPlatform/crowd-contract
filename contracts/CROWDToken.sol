// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ICROWDToken.sol";

contract CROWDToken is ICROWDToken{

    constructor(uint256 amount) ERC20("CROWD.com", "CROWD") {
        _mint(_msgSender(), amount*10**decimals());
    }

    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }
}
