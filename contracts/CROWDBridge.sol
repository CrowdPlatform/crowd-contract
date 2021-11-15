// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./CROWDValidator.sol";
import "./ICROWDToken.sol";

//토큰 주소 등록 : eth -> bsc, bsc -> eth

contract CrowdBridge is Ownable, CROWDValidator{    
    using ECDSA for bytes32;

    uint network_type;
    constructor(uint network){
        network_type = network;
    }

    mapping(address => address) _mapEthBsc;

    receive () payable external{
        revert();
    }

    function resigtryMapEthBsc(address from_address, address to_address) public onlyOwner{
        require(isContract(from_address) == true);
        // IERC20 erc20 = IERC20(from_address);
        // require(erc );
        _mapEthBsc[from_address] = to_address;
    }

    event LogTransferToNetwork(address indexed to_account, uint256 amount, string to_network);
    event LogTransferFromNetwork(string from_network, bytes32 indexed txhash, address indexed to_account, uint256 indexed amount);

    //
    function transferToNetwork(address contract_address, address to_account, uint256 amount, string memory to_network) public {
        require(_mapEthBsc[contract_address] != address(0));
        ICROWDToken erc20 = ICROWDToken(contract_address);
        erc20.burnFrom(msg.sender, amount);

        emit LogTransferToNetwork(to_account, amount, to_network);

    }

    function getHash(string memory message, uint256 id) internal pure returns (bytes32){
        return  keccak256(
             abi.encodePacked(
                message,
                id
        ));
    }

    function confirm(address contract_address, uint256 id, string memory from_network, bytes32 txhash, uint256 amount, bytes memory signature) public {
        require(isProcessed(id) == false);
       
        require(_mapEthBsc[contract_address] != address(0));
        ICROWDToken erc20 = ICROWDToken(contract_address);
        erc20.mint(msg.sender, amount);//TODO: role

        //TODO: verify signature

        bytes32 _hash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",                
                getHash(
                    "transfer",
                    id
                )
            )
        );        
        address signer = _hash.recover(signature);
        
        require(signer == msg.sender, "invalid signer");

        setProcessed(id);


        emit LogTransferFromNetwork(from_network, txhash, msg.sender, amount);
    }
}
