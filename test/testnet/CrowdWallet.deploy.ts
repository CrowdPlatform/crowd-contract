
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import IDOWalletArtifact from '../../artifacts/contracts/IDOWallet.sol/IDOWallet.json';
import { IDOWallet } from '../../typechain/IDOWallet';
import { CROWDToken } from '../../typechain/CROWDToken';
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractError } from "../ContractError";
import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { time } from "console";

const { deployContract } = waffle;

const decimal = BigNumber.from((10 ** 18).toString());
let idoWallet: IDOWallet;
let ticketContract: CROWDToken;
let tokenAddress: string;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    var network = await ethers.provider.getNetwork();
    // console.log(network);

    console.log(accounts[0].address);


    if (network.name === 'bnbt') {
        idoWallet = await ethers.getContractAt("IDOWallet", '0x04F50E78F3ac8aF6DA595E691D987B01cCD55c5E')
        ticketContract = await ethers.getContractAt("CROWDToken", '0xec3F0f773768e9Ec1fDa6c7C8954a71f9A3Eb6DB');
        tokenAddress = ticketContract.address;
    }
    else if(network.name === 'ropsten'){
        // idoWallet = await ethers.getContractAt("IDOWallet", '');
        // tokenAddress = (await ethers.getContractAt("CROWDToken", '0x3646686CEFdB7FBCD9A3488F198f5834251548AB')).address;
    }
    else {
        console.log(network);
        return;
    }

    if (!idoWallet) {
        const factory = await ethers.getContractFactory("IDOWallet");
        idoWallet = await factory.deploy();
    }
    console.log(idoWallet.address);

    var validator = await idoWallet.getValidator(tokenAddress);
    if (validator !== '0xBBCaE96A030979529AE522064c893e15E4425054' && tokenAddress) {
        console.log('validator set');
        await idoWallet.setValidator(tokenAddress, '0xBBCaE96A030979529AE522064c893e15E4425054');
    }


    var receiver = await idoWallet.getReciver();
    if (receiver !== accounts[0].address) {
        await (await idoWallet.setReciever(accounts[0].address)).wait(1);
        var receiver = await idoWallet.getReciver();
        console.log(receiver);        
    }

    // await ticketContract.connect(accounts[0]).approve(idoWallet.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
}

main();