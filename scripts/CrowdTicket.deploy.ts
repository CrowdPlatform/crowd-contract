
import { ethers, waffle } from "hardhat";

import { CROWDToken } from '../typechain/CROWDToken';
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
        crowdToken = await ethers.getContractAt("CROWDToken", '0xec3F0f773768e9Ec1fDa6c7C8954a71f9A3Eb6DB');
    }
    // else if (network.name === 'ropsten') {
    //     // crowdToken = await ethers.getContractAt("CROWDToken", '');
    // }
    else {
        console.log(network);
        return;
    }

    if (!crowdToken) {
        const factory = await ethers.getContractFactory("CROWDToken");
        crowdToken = await factory.deploy(
            "ticket." + network.name + ".com",
            "TICKET",
            "1000000000");
    }
    console.log(crowdToken.address);
}


main();