// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ICROWDToken is ERC20, Pausable, Ownable {

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
    function burnFrom(address account, uint256 amount) public virtual {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }    

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "ERC20Pausable: token transfer while paused");
    }    

    function setPause() public{
        _pause();
    }

    //TODO: 최소 전송 수량 제한을 컨트랙트에서 확인할 것 인가?
    // uint256 minimum_swap_amount = 10000*10**decimals();

    event LogTransferToNetwork(address indexed to_account, uint256 indexed amount, string to_network);
    event LogTransferFromNetwork(string from_network, bytes32 indexed txhash, address indexed to_account, uint256 indexed amount);

    function transferToNetwork(address to_account, uint256 amount, string memory to_network) public {

        //TODO: mimimum swap amount
        // require(amount >= minimum_swap_amount, 'limited : minimum swap amount');

        //to_account is assumed verified address
        burn(amount);

        emit LogTransferToNetwork(to_account, amount, to_network);
    }

    function transferFromNetwork(string memory from_network, bytes32 txhash, address account, uint256 amount, address fee_account, uint256 fee_amount) public onlyOwner{
        _mint(account, amount);

        if(fee_amount > 0)
            _mint(fee_account, fee_amount);

        emit LogTransferFromNetwork(from_network, txhash, account, amount);
    }
}
