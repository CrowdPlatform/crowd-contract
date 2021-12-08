
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import CROWDInvestArtifact from '../../artifacts/contracts/CROWDInvest.sol/CROWDInvest.json';
import { CROWDInvest } from '../../typechain/CROWDInvest';
import { CROWDToken } from '../../typechain/CROWDToken';
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractError } from "../ContractError";
import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const { deployContract } = waffle;

const decimal = BigNumber.from((10 ** 18).toString());
let crowdInvest: CROWDInvest;
let busdToken: CROWDToken;
var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    var network = await ethers.provider.getNetwork();
    // console.log(network);

    console.log(accounts[0].address);


    if (network.name === 'bnbt') {
        // crowdInvest = await ethers.getContractAt("CROWDInvest",'0x842BA0C6b7eaE7559cbA867D1EFc771df457866C');
        // crowdInvest = await ethers.getContractAt("CROWDInvest", '0xF59f70Ae2BD0FF3ED2DeF771D9464781922fe382');
        crowdInvest = await ethers.getContractAt("CROWDInvest", '0x69e3C8B89bD520422b34499ed5879258437b65C4');
        
        busdToken = await ethers.getContractAt("CROWDToken", '0x86dDC7e76bD30fEA987380f8C5C2bE4a5B43A42C');
    }
    else {
        console.log(network);
        return;
    }

    if (!crowdInvest) {
        crowdInvest = await deployContract(
            accounts[0],
            CROWDInvestArtifact,
            [
            ]
        ) as CROWDInvest;
    }
    console.log(crowdInvest.address);

    var receiver = await crowdInvest.getReciver();
    if (receiver !== accounts[0].address) {
        await (await crowdInvest.setReciever(accounts[0].address)).wait(1);
        var receiver = await crowdInvest.getReciver();
        console.log(receiver);
    }


    // await createPool2();
    // var poolInfo = await crowdInvest.getPool(6);
    // console.log(poolInfo);


    // console.log(whitelist);
    // if(!whitelist){
    // await registWhiteList();
    // }

    var id = 2;

    // await createPool();

    // await registWhiteList();

    //approve busd for invest contract
    for(var i = 1; i<accounts.length; ++i){
        var allowance = await busdToken.allowance(accounts[i].address, crowdInvest.address);
        if(allowance.eq(0)){
            await busdToken.connect(accounts[i]).approve(crowdInvest.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
        }
    }

    var poolInfo = await crowdInvest.getPool(id);
    // console.log(poolInfo);

    var amount = decimal.mul(99);
    for (var i = 1; i < accounts.length; ++i) {
        // await (await busdToken.transfer(accounts[i].address, amount)).wait(1);
        var result = await InvestPool(accounts[i], id, amount);
        if(result === false) break;
        amount = amount.add(decimal);
    }
}

async function InvestPool(test: Signer, id: BigNumberish, amount: BigNumberish): Promise<boolean> {
    var res = true;
    try {
        // function investPool(uint256 invest_id, uint256 amount) public
        await (await crowdInvest.connect(test).investPool(id, amount, { gasLimit: '1000000'})).wait(1);
    } catch (error) {
        console.log((error as ContractError));
        res = false;
    } finally {
        return res;
    }
}
async function createPool() {
    var id = 1;
    var main_per_ticket = 100;
    var main_token = busdToken.address;
    var total_amount = decimal.mul(10000);
    var ts_start_time = Math.floor(Date.now() / 1000);
    var ts_finish_time = ts_start_time + 1000;
    var state = 0;

    var poolInfo = await crowdInvest.getPool(id);
    if (poolInfo.total_amount.eq(0)) {
        console.log('create pool:' + id);
        var res = await (await crowdInvest.createPool(id, main_per_ticket, main_token, total_amount, ts_start_time, ts_finish_time, state)).wait(1);
        console.log(res);
    } else
        console.log('pool is already created.');
}

async function createPool2() {
    var id = 6;
    var main_per_ticket = 100;
    var main_token = busdToken.address;
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
    var users: string[] = [accounts[1].address, accounts[2].address, accounts[3].address];
    var amounts: BigNumber[] = [BigNumber.from('100'), BigNumber.from('100'), BigNumber.from('100')];
    // for (var i = 0; i < 300; i++) {
    //     users.push(accounts[0].address);
    //     amounts.push(decimal);
    // }

    var white_list = await crowdInvest.getWhiteList(id);
    if(white_list[0].length == 0){
        var res = await (await crowdInvest.registWhiteList(id, users, amounts, {gasLimit:'1000000'})).wait(1);
        console.log(res);
    }
}
main();