import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import { CROWDTokenBSC } from "../typechain/CROWDTokenBSC";
import { CROWDStaking } from "../typechain/CROWDStaking";
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { deployContract } = waffle;

const decimal = BigNumber.from((10 ** 18).toString());
let crowdToken: CROWDTokenBSC;
let crowdStaking: CROWDStaking;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    var network = await ethers.provider.getNetwork();

    var crowdTokenAddress: string = "";
    var crowdStakeAddress: string = "";

    switch (network.chainId) {
        case 1: //ethereum
        case 3: //ropsten
            break;
        case 56: //bsc
            crowdTokenAddress = process.env.CROWDTOKEN_ADDRESS_BNB || "";
            crowdStakeAddress = process.env.CROWDSTAKE_ADDRESS_BNB || "";
            break;
        case 97: //bsc testnet
            crowdTokenAddress = process.env.CROWDTOKEN_ADDRESS_BNBT || "";
            crowdStakeAddress = process.env.CROWDSTAKE_ADDRESS_BNBT || "";
            break;
        default:
            console.log(network);
            return;
    }

    if (crowdTokenAddress.length === 0) {
        console.log("crowdToken address is not setted.");
        return;
    }

    if (crowdStakeAddress.length > 0) {
        crowdStaking = await ethers.getContractAt("CROWDStaking", crowdStakeAddress);
    }

    if (!crowdStaking) {
        const factory = await ethers.getContractFactory("CROWDStaking");
        crowdStaking = await factory.deploy();
    }
    console.log(crowdStaking.address);

    await crowdStaking.setToken(crowdTokenAddress);
}

main();
