import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import { CrowdBridge } from "../typechain/CrowdBridge";
import { CROWDToken } from "../typechain/CROWDToken";
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
    var network = await ethers.provider.getNetwork();

    var name = "CROWD";
    var symbol = "CWD";
    var amount = "0";

    switch (network.chainId) {
        case 1: //ethereum
            amount = "2500000000";
            break;
        case 56: //bsc
            amount = "0";
            break;
        case 3: //ropsten
            amount = "2500000000";
            name = name + ".ropsten";
            break;
        case 97: //bsc testnet
            name = name + ".bnbt";
            break;
        default:
            console.log(network);
            return;
    }

    if (!crowdToken) {
        const factory = await ethers.getContractFactory("CROWDToken");
        crowdToken = await factory.deploy(name, symbol, amount);
    }
    console.log(crowdToken.address);

    // console.log(validator);

    // await crowdToken.connect(accounts[0]).transfer(testAccount.address, '1000000000000000000000000');
    // await crowdToken.connect(testAccount).approve(crowdBridge.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
}

main();
