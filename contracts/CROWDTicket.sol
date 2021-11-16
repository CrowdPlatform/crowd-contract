// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ICROWDToken.sol";
import "./ECDSA.sol";
import "./CROWDValidator.sol";

contract CROWDTicket is ICROWDToken, CROWDValidator{
    using ECDSA for bytes32;

    constructor(uint256 amount) ERC20("CROWD.com", "Ticket"){
        _mint(_msgSender(), amount*10**decimals());
    }

    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }

    function deposit(address account, uint256 amount) public{
        transferFrom(msg.sender, account, amount);
    }

    function withdraw(uint256 amount, uint256 id, bytes memory signature) public{

        verify("ticketclaim", id, msg.sender, amount, address(this), getValidator(address(this)), signature);

        transfer(msg.sender, amount);
    }

}
