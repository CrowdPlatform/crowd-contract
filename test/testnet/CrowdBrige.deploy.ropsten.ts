
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import CrowdDBridgeArtifact from '../../artifacts/contracts/CROWDBridge.sol/CrowdBridge.json';
import { CrowdBridge } from '../../typechain/CrowdBridge';
import { CROWDToken } from '../../typechain/CROWDToken';
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { deployContract } = waffle;

const decimal = BigNumber.from((10 ** 18).toString());
// const busdTokenAddress = '0x86dDC7e76bD30fEA987380f8C5C2bE4a5B43A42C';
let crowdBridge: CrowdBridge;
let crowdToken: CROWDToken;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();


    console.log(accounts[0].address);

    crowdBridge = await ethers.getContractAt("CrowdBridge",'0xD7EC11f170f75c77aE50BDA26B55892f0bd21561');
    crowdToken = await ethers.getContractAt("CROWDToken", '0x194226FD672e3830A017cDd178F6cFbbfed98559');


    if(!crowdBridge){
        crowdBridge = await deployContract(
            accounts[0],
            CrowdDBridgeArtifact,
            [
            ]
        ) as CrowdBridge;
    }
    console.log(crowdBridge.address);

    // await crowdToken.approve(crowdBridge.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');

    await crowdBridge.transferToNetwork(crowdToken.address, accounts[0].address, '1000000000000000000', 'bsc');

    // await this.bridge.resigtryMapEthBsc(this.crowd.address, '0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');        
    // // await this.bridge.resigtryMapEthBsc(this.busd.address, this.crowd.address);        
    // await this.bridge.setValidator(this.crowd.address, this.validator);

}


main();