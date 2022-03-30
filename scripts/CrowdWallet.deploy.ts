import { ethers, waffle } from "hardhat";

import { IDOWallet } from "../typechain/IDOWallet";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

let idoWallet: IDOWallet;
let tokenContract;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    var network = await ethers.provider.getNetwork();

    var tokenAddress: string;

    var validatorAddress = process.env.VALIDATOR || "";
    var recieverAddress = process.env.RECIEVER || "";

    if (recieverAddress.length === 0) {
        console.log("reciverAddress is not set");
        return;
    }
    if (validatorAddress.length === 0) {
        console.log("validatorAddress is not set");
        return;
    }

    switch (network.chainId) {
        case 1: //ethereum
            tokenAddress = process.env.TICKET_ADDRESS_ETH || "";
            break;
        case 56: //bsc
            tokenAddress = process.env.TICKET_ADDRESS_BNB || "";
            break;
        case 3: //ropsten
            tokenAddress = process.env.TICKET_ADDRESS_ROPSTEN || "";
            break;
        case 97: //bsc testnet
            tokenAddress = process.env.TICKET_ADDRESS_BNBT || "";
            break;
        case 1001: //baobab
            tokenAddress = process.env.TICKET_ADDRESS_BAOBAB || "";
            idoWallet = await ethers.getContractAt("IDOWallet", process.env.BAOBAB_WALLET || "");
            break;
        default:
            console.log(network.chainId);
            console.log(network);
            return;
    }
    if (tokenAddress.length === 0 && (network.chainId === 56 || network.chainId === 97)) {
        console.log("ticket address is not setted.");
        return;
    }

    if (!idoWallet) {
        const factory = await ethers.getContractFactory("IDOWallet");
        idoWallet = await factory.deploy();
    }
    console.log(idoWallet.address);

    if (tokenAddress.length > 0) {
        tokenContract = await ethers.getContractAt("IERC20", tokenAddress);
        var validator = await idoWallet.getValidator(tokenAddress);
        if (validator !== validatorAddress) {
            // console.log("validator set");
            await idoWallet.setValidator(tokenAddress, validatorAddress);
        }

        // await tokenContract.connect(accounts[0]).approve(idoWallet.address, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
    }

    var receiver = await idoWallet.getReciver();
    console.log(receiver);
    if (receiver !== recieverAddress) {
        await idoWallet.setReciever(recieverAddress);
        var receiver = await idoWallet.getReciver();
        console.log(receiver);
    }
}

main();
