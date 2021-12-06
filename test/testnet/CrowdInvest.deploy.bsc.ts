
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import CROWDInvestArtifact from '../artifacts/contracts/CROWDInvest.sol/CROWDInvest.json';
import { CROWDInvest } from '../typechain/CROWDInvest';
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import {config} from 'hardhat.config.ts';
// import Web3 from 'Web3';
// import { hashMessage } from "@ethersproject/hash";
// import { ContractError } from "./ContractError";

const { deployContract } = waffle;

const decimal = BigNumber.from((10 ** 18).toString());
const busdTokenAddress = '0x86dDC7e76bD30fEA987380f8C5C2bE4a5B43A42C';
let crowdInvest: CROWDInvest;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();


    console.log(accounts[0].address);

    crowdInvest = await ethers.getContractAt("CROWDInvest",'0x842BA0C6b7eaE7559cbA867D1EFc771df457866C');


    if(!crowdInvest){
        crowdInvest = await deployContract(
            accounts[0],
            CROWDInvestArtifact,
            [
            ]
        ) as CROWDInvest;
    }
    console.log(crowdInvest.address);


    // await crowdInvest.setReciever(accounts[2].address);
    var receiver = await crowdInvest.getReciver();
    console.log(receiver);
    // await createPool2();
    // var poolInfo = await crowdInvest.getPool(6);
    // console.log(poolInfo);
    
    // await createPool();

    // var id = 1;
    // var whitelist = await crowdInvest.getWhiteList(id);
    // console.log(whitelist);
    // if(!whitelist){
        // await registWhiteList();
    // }
}


async function createPool() {
    var id = 1;
    var main_per_ticket = 10;
    var main_token = busdTokenAddress;
    var total_amount = decimal.mul(10000);
    var ts_start_time = Math.floor(Date.now() / 1000);
    var ts_finish_time = ts_start_time + 1000;
    var state = 0;

    var poolInfo = await crowdInvest.getPool(id);
    if (poolInfo.total_amount.eq(0)) {
        console.log('create pool:' + id);
        var res = await crowdInvest.createPool(id, main_per_ticket, main_token, total_amount, ts_start_time, ts_finish_time, state);
        console.log(res.hash);
    } else
        console.log('pool is already created.');
}

async function createPool2() {
    var id = 6;
    var main_per_ticket = 100;
    var main_token = busdTokenAddress;
    var total_amount = 500000;
    var ts_start_time = 1638630000;
    var ts_finish_time = 1639062000;
    var state = 0;

    console.log('create pool:' + id);
    var res = await crowdInvest.createPool(id, main_per_ticket, main_token, total_amount, ts_start_time, ts_finish_time, state);
    console.log(res.hash);
}
async function registWhiteList() {
    var id = 1;
    var users: string[] = [];
    var amounts: BigNumber[] = [];
    for(var i=0; i<300; i++){
        users.push(accounts[0].address);
        amounts.push(decimal);
    }
    var res = await crowdInvest.registWhiteList(id, users, amounts);
    console.log(res);
}
main();