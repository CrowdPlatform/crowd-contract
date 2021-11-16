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

    function withdraw(address account, uint256 amount, uint256 id, bytes memory signature) public{
        bytes32 _hash = ECDSA.getHash("ticketclaim",id,msg.sender,amount).toEthSignedMessageHash();
  
        address signer = _hash.recover(signature);
        
        require(signer == getValidator(address(this)), "invalid signer");

        transfer(account, amount);
    }

}
