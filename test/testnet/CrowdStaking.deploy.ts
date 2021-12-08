
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import { CROWDToken } from '../../typechain/CROWDToken';
import { CROWDStaking } from '../../typechain/CROWDStaking';
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { deployContract } = waffle;

const decimal = BigNumber.from((10 ** 18).toString());
let crowdToken: CROWDToken;
let crowdStaking: CROWDStaking;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    console.log(accounts.map(e=>e.address));
    var network = await ethers.provider.getNetwork();

    var testAccount = accounts[1];
    console.log(testAccount.address);

    if (network.name === 'bnbt') {
        crowdStaking = await ethers.getContractAt("CROWDStaking", '0xc0688BCD741a30E43C50e8B2D55534c3c3aE5D98');
        crowdToken = await ethers.getContractAt("CROWDToken", '0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');
    }
    else {
        console.log(network);
        return;
    }

    if (!crowdStaking) {
        const factory = await ethers.getContractFactory("CROWDStaking");
        crowdStaking = await factory.deploy();
    }
    console.log(crowdToken.address);


    await crowdStaking.setToken(crowdToken.address);
}


main();