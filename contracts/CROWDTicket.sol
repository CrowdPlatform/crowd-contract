// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
// import "@openzeppelin/contracts/security/Pausable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

import "./ICROWDToken.sol";

contract CROWDTicket is ICROWDToken{

    constructor(uint256 amount) ERC20("CROWD.com", "Ticket"){
        _mint(_msgSender(), amount*10**decimals());
    }

    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }

    function claim(address account, uint256 amount, address fee_account, uint256 fee_amount) public onlyOwner{
        transfer(account, amount);
        if(fee_account != _msgSender())
            transfer(fee_account, fee_amount);
    }
}
