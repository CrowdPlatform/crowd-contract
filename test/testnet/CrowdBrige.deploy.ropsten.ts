
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

console.log(process.argv);

async function main() {
    accounts = await ethers.getSigners();

    var testAccount = accounts[1];
    console.log(testAccount.address);

    crowdBridge = await ethers.getContractAt("CrowdBridge",'0xD7EC11f170f75c77aE50BDA26B55892f0bd21561');
    crowdToken = await ethers.getContractAt("CROWDToken", '0x3646686CEFdB7FBCD9A3488F198f5834251548AB');


    if(!crowdBridge){
        crowdBridge = await deployContract(
            accounts[0],
            CrowdDBridgeArtifact,
            [
            ]
        ) as CrowdBridge;
    }
    console.log(crowdBridge.address);
    console.log(crowdToken.address);

    var isMinter = await crowdToken.isMinter(crowdBridge.address);
    if(isMinter === false)
    {
        console.log('minter is not added');
        await crowdToken.addMinters([crowdBridge.address]);
        // return;
    }

    

    await crowdBridge.resigtryMapEthBsc(crowdToken.address, '0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');        
    // // await crowdBridge.resigtryMapEthBsc(this.busd.address, this.crowd.address);        

    var validator = await crowdBridge.getValidator(crowdToken.address);
    if(validator !== '0xBBCaE96A030979529AE522064c893e15E4425054')
        await crowdBridge.setValidator(crowdToken.address, '0xBBCaE96A030979529AE522064c893e15E4425054');


    // await crowdToken.connect(accounts[0]).transfer(testAccount.address, '1000000000000000000000000');
    // await crowdToken.connect(testAccount).approve(crowdBridge.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');

    // await crowdBridge.connect(testAccount).transferToNetwork(crowdToken.address, testAccount.address, '1000000000000000000', 'bsc');
    // await crowdBridge.transferToNetwork(crowdToken.address, accounts[0].address, '1000000000000000000', 'bsc');

}


main();