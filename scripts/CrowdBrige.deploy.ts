import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import { CrowdBridge } from "../typechain/CrowdBridge";
import { CROWDToken } from "../typechain/CROWDToken";
import { CROWDTokenBSC } from "../typechain/CROWDTokenBSC";
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const decimal = BigNumber.from((10 ** 18).toString());
let crowdBridge: CrowdBridge;
let crowdToken: CROWDToken | CROWDTokenBSC;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    var network = await ethers.provider.getNetwork();

    var crowdTokenAddress: string;
    var crowdBridgeAddress: string;
    var validatorAddress = process.env.VALIDATOR || "";

    if (validatorAddress.length === 0) {
        console.error("validator address is not set");
        return;
    }

    let contractName = "CROWDToken";

    switch (network.chainId) {
        case 1: //ethereum
            crowdTokenAddress = process.env.CROWDTOKEN_ADDRESS_ETH || "";
            crowdBridgeAddress = process.env.CROWDBRIDGE_ADDRESS_ETH || "";
            break;
        case 3: //ropsten
            crowdTokenAddress = process.env.CROWDTOKEN_ADDRESS_ROPSTEN || "";
            crowdBridgeAddress = process.env.CROWDBRIDGE_ADDRESS_ROPSTEN || "";
            break;
        case 56: //bsc
            crowdTokenAddress = process.env.CROWDTOKEN_ADDRESS_BNB || "";
            crowdBridgeAddress = process.env.CROWDBRIDGE_ADDRESS_BNB || "";
            contractName = "CROWDTokenBSC";
            break;
        case 97: //bsc testnet
            crowdTokenAddress = process.env.CROWDTOKEN_ADDRESS_BNBT || "";
            crowdBridgeAddress = process.env.CROWDBRIDGE_ADDRESS_BNBT || "";
            contractName = "CROWDTokenBSC";
            break;
        default:
            console.log(network);
            return;
    }

    if (crowdTokenAddress.length === 0) {
        console.log("crowdToken address is not setted.");
        return;
    }

    if (contractName === "CROWDToken") crowdToken = await ethers.getContractAt("CROWDToken", crowdTokenAddress);
    else crowdToken = await ethers.getContractAt("CROWDTokenBSC", crowdTokenAddress);

    if (crowdBridgeAddress.length > 0) {
        crowdBridge = await ethers.getContractAt("CrowdBridge", crowdBridgeAddress);
    }

    if (!crowdBridge) {
        const factory = await ethers.getContractFactory("CrowdBridge");
        crowdBridge = await factory.deploy();
    }
    console.log(crowdBridge.address);

    var isMinter = await crowdToken.isMinter(crowdBridge.address);
    if (isMinter === false) {
        console.log("minter is not added");
        await (await crowdToken.addMinters([crowdBridge.address])).wait(1);
    }

    let registed = await crowdBridge.registContract(crowdToken.address);
    if (registed === false) await (await crowdBridge.registContrac(crowdToken.address)).wait(1);

    var validator = await crowdBridge.getValidator(crowdToken.address);
    if (validator !== validatorAddress) {
        console.log("validator set");
        await (await crowdBridge.setValidator(crowdToken.address, validatorAddress)).wait(1);
    }

    // await crowdBridge.connect(testAccount).transferFromNetwork(crowdToken.address, '10110000000000000004', 'eth', '0x03684f35ddfe309f448cc74605616dbb3121d9d84898a193979e4e4e1c234ba0', '4000000000000000000', 0, '0x102510f54ee0916a8bd8f511a785e2b3d84fff798aeb510125608488c939909d567f5773028e4ca44a2273ee43bf558020c0a4b14ca0a816b436cce0de6370031c');
    // await crowdToken.connect(accounts[0]).transfer(testAccount.address, '1000000000000000000000000');
    // await crowdToken.connect(testAccount).approve(crowdBridge.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');

    // await crowdBridge.connect(testAccount).transferToNetwork(crowdToken.address, testAccount.address, '1000000000000000000', 'bsc');
    // await crowdBridge.transferToNetwork(crowdToken.address, accounts[0].address, '1000000000000000000', 'bsc');

    // await this.bridge.registContrac(this.crowd.address, '0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');
    // // await this.bridge.registContrac(this.busd.address, this.crowd.address);
    // await this.bridge.setValidator(this.crowd.address, this.validator);
}

// async function getAccounts() {
//     accounts = await ethers.getSigners();
//     console.log(accounts.map(a=>a.address));
// }

// getAccounts();

main();
