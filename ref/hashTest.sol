
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract hashTest{    


    function getPackedEncode(string memory message, uint256 id, address contract_addr, uint256 amount) public view returns (bytes memory){
        return  abi.encodePacked(
                message,
                id
                // ,
                // contract_addr,
                // amount
        );
    }
}
