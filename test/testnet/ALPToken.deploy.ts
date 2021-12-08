
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import { CROWDToken } from '../../typechain/CROWDToken';
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const decimal = BigNumber.from((10 ** 18).toString());
let crowdToken: CROWDToken;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    console.log(accounts.map(e=>e.address));
    var network = await ethers.provider.getNetwork();

    var testAccount = accounts[1];
    console.log(testAccount.address);

    if (network.name === 'bnbt') {
        // crowdToken = await ethers.getContractAt("CROWDToken", '');
    }
    else if (network.name === 'ropsten') {
        crowdToken = await ethers.getContractAt("CROWDToken", '');
    }
    else {
        console.log(network);
        return;
    }

    if (!crowdToken) {
        const factory = await ethers.getContractFactory("CROWDToken");
        crowdToken = await factory.deploy(
            "alpha." + network.name,
            "ALP",
            "1000000000");
    }
    console.log(crowdToken.address);
}


main();