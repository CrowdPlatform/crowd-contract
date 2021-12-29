import { ethers } from "hardhat";

import { CROWDToken } from "../typechain/CROWDToken";
import { CROWDTokenBSC } from "../typechain/CROWDTokenBSC";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

let crowdToken: CROWDToken | CROWDTokenBSC;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    var network = await ethers.provider.getNetwork();

    var name = "CROWD";
    var symbol = "CWD";
    var amount = "0";
    var maxSupply = null;

    var factory: any;
    var tokenAddress: string;

    switch (network.chainId) {
        case 1: //ethereum
            tokenAddress = process.env.CROWDTOKEN_ADDRESS_ETH || "";

            if (tokenAddress !== "") crowdToken = await ethers.getContractAt("CROWDToken", tokenAddress);
            else {
                factory = await ethers.getContractFactory("CROWDToken");
                amount = "2500000000";
            }
            break;
        case 3: //ropsten
            tokenAddress = process.env.CROWDTOKEN_ADDRESS_ROPSTEN || "";

            if (tokenAddress !== "") crowdToken = await ethers.getContractAt("CROWDToken", tokenAddress);
            else {
                factory = await ethers.getContractFactory("CROWDToken");
                amount = "2500000000";
                name = name + ".ropsten";
            }
            break;

        case 56: //bsc
            tokenAddress = process.env.CROWDTOKEN_ADDRESS_BNB || "";
            if (tokenAddress !== "") crowdToken = await ethers.getContractAt("CROWDTokenBSC", tokenAddress);
            else {
                factory = await ethers.getContractFactory("CROWDTokenBSC");
                amount = "0";
                maxSupply = "2500000000";
            }
            break;
        case 97: //bsc testnet
            tokenAddress = process.env.CROWDTOKEN_ADDRESS_BNBT || "";
            console.log(tokenAddress);
            if (tokenAddress !== "") crowdToken = await ethers.getContractAt("CROWDTokenBSC", tokenAddress);
            else {
                factory = await ethers.getContractFactory("CROWDTokenBSC");
                maxSupply = "2500000000";
                name = name + ".bnbt";
            }
            break;
        default:
            console.log(network);
            return;
    }

    if (!crowdToken) {
        if (maxSupply === null) crowdToken = await factory.deploy(name, symbol, amount);
        else crowdToken = await factory.deploy(name, symbol, amount, maxSupply);
    }
    console.log(crowdToken.address);
}

main();
