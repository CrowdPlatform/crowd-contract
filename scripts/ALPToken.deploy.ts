
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import { CROWDToken } from '../typechain/CROWDToken';
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const decimal = BigNumber.from((10 ** 18).toString());
let alpToken: CROWDToken;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    // console.log(accounts.map(e=>e.address));
    var network = await ethers.provider.getNetwork();

    // var testAccount = accounts[1];
    // console.log(testAccount.address);

    if (network.name === 'bnbt') {
        alpToken = await ethers.getContractAt("CROWDToken", '0x689c0F4E84703d03468f39971d0c12E02e6F349D');
    }
    else if (network.name === 'ropsten') {
        alpToken = await ethers.getContractAt("CROWDToken", '0x2Ba155D1D567D98458b335A51D25a24a3b0f23ec');
    }
    else if (network.name === 'maticmum') {
        // alpToken = await ethers.getContractAt("CROWDToken", '0x2Ba155D1D567D98458b335A51D25a24a3b0f23ec');
    }
    else {
        console.log(network);
        return;
    }

    if (!alpToken) {
        const factory = await ethers.getContractFactory("CROWDToken");
        alpToken = await factory.deploy(
            "alpha." + network.name,
            "ALP",
            "1000000000");
    }
    console.log(alpToken.address);
}


main();