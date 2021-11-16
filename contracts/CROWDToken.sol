// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
// // import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
// import "@openzeppelin/contracts/security/Pausable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

import "./ICROWDToken.sol";

contract CROWDToken is ICROWDToken{

    // constructor(
    //     string memory name,
    //     string memory symbol,
    //     uint256 initialSupply,
    //     address owner
    // ) ERC20(name, symbol) {
    //     _mint(owner, initialSupply);
    // }
    constructor(uint256 amount) ERC20("CROWD.com", "CROWD") {
        _mint(_msgSender(), amount*10**decimals());
        // minimum_swap_amount = 10000*10**decimals();        
    }

    //Don't accept ETH or BNB
    receive () payable external{
        revert();
    }
}
