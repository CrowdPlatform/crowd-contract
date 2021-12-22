import { ethers, waffle } from "hardhat";

import { CROWDToken } from "../typechain/CROWDToken";
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const decimal = BigNumber.from((10 ** 18).toString());
let crowdToken: CROWDToken;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    var network = await ethers.provider.getNetwork();

    var name = "CROWD TICKET";
    var symbol = "TICKET";
    var amount = "0";

    switch (network.chainId) {
        case 56: //bsc
            amount = "1000000000";
            break;
        case 97: //bsc testnet
            name = name + ".bnbt";
            break;
        case 3: //ropsten
        case 1: //ethereum
        default:
            console.log(network);
            return;
    }

    if (!crowdToken) {
        const factory = await ethers.getContractFactory("CROWDToken");
        crowdToken = await factory.deploy(name, symbol, amount);
    }
    console.log(crowdToken.address);
}

main();
