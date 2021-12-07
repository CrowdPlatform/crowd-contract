
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import CrowdDBridgeArtifact from '../../artifacts/contracts/CROWDBridge.sol/CrowdBridge.json';
import { CrowdBridge } from '../../typechain/CrowdBridge';
import { CROWDToken } from '../../typechain/CROWDToken';
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { deployContract } = waffle;

const decimal = BigNumber.from((10 ** 18).toString());
let crowdBridge: CrowdBridge;
let crowdToken: CROWDToken;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    var network = await ethers.provider.getNetwork();

    var testAccount = accounts[1];
    console.log(testAccount.address);

    if (network.name === 'bnbt') {
        crowdBridge = await ethers.getContractAt("CrowdBridge", '0xBb3f0d89b6DcC11630Edff82A455470Ecf676B02');
        crowdToken = await ethers.getContractAt("CROWDToken", '0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');
    }
    else if (network.name === 'ropsten') {
        crowdBridge = await ethers.getContractAt("CrowdBridge", '0xD7EC11f170f75c77aE50BDA26B55892f0bd21561');
        crowdToken = await ethers.getContractAt("CROWDToken", '0x3646686CEFdB7FBCD9A3488F198f5834251548AB');
    }
    else {
        console.log(network);
        return;
    }

    if (!crowdBridge) {
        crowdBridge = await deployContract(
            accounts[0],
            CrowdDBridgeArtifact,
            [
            ]
        ) as CrowdBridge;
    }
    console.log(crowdBridge.address);

    var isMinter = await crowdToken.isMinter(crowdBridge.address);
    if (isMinter === false) {
        console.log('minter is not added');
        await crowdToken.addMinters([crowdBridge.address])
        // return;
    }

    if (network.name === 'bnbt') {
        await crowdBridge.resigtryMapEthBsc(crowdToken.address, '0x3646686CEFdB7FBCD9A3488F198f5834251548AB');
    }
    else if (network.name === 'ropsten') {
        await crowdBridge.resigtryMapEthBsc(crowdToken.address, '0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');
    }
    else {
    }

    var validator = await crowdBridge.getValidator(crowdToken.address);
    if (validator !== '0xBBCaE96A030979529AE522064c893e15E4425054') {
        console.log('validator set');
        await crowdBridge.setValidator(crowdToken.address, '0xBBCaE96A030979529AE522064c893e15E4425054');
    }


    // await crowdBridge.connect(testAccount).transferFromNetwork(crowdToken.address, '10110000000000000004', 'eth', '0x03684f35ddfe309f448cc74605616dbb3121d9d84898a193979e4e4e1c234ba0', '4000000000000000000', 0, '0x102510f54ee0916a8bd8f511a785e2b3d84fff798aeb510125608488c939909d567f5773028e4ca44a2273ee43bf558020c0a4b14ca0a816b436cce0de6370031c');
    // await crowdToken.connect(accounts[0]).transfer(testAccount.address, '1000000000000000000000000');
    // await crowdToken.connect(testAccount).approve(crowdBridge.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');

    // await crowdBridge.connect(testAccount).transferToNetwork(crowdToken.address, testAccount.address, '1000000000000000000', 'bsc');
    // await crowdBridge.transferToNetwork(crowdToken.address, accounts[0].address, '1000000000000000000', 'bsc');

    // await this.bridge.resigtryMapEthBsc(this.crowd.address, '0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');        
    // // await this.bridge.resigtryMapEthBsc(this.busd.address, this.crowd.address);        
    // await this.bridge.setValidator(this.crowd.address, this.validator);

}

async function getAccounts() {
    accounts = await ethers.getSigners();
    console.log(accounts.map(a=>a.address));
}

getAccounts();

// main();