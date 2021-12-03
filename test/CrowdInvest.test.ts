
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import CROWDTokenArtifact from '../artifacts/contracts/CROWDToken.sol/CROWDToken.json';
import CROWDInvestArtifact from '../artifacts/contracts/CROWDInvest.sol/CROWDInvest.json';
import { CROWDToken } from '../typechain/CROWDToken';
import { CROWDInvest } from '../typechain/CROWDInvest';
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import Web3 from 'Web3';
import { hashMessage } from "@ethersproject/hash";
import { ContractError } from "./ContractError";
import { toASCII } from "punycode";

const { deployContract } = waffle;



describe('CROWD Invest Pool', () => {

    let busdToken: CROWDToken;
    let alphaToken: CROWDToken;
    let crowdInvest: CROWDInvest;

    const provider = waffle.provider;

    const accounts = provider.getWallets();
    const [admin, test1] = accounts;
    const decimal = BigNumber.from((10 ** 18).toString());

    console.log('account length : ' + accounts.length);
    // console.log(accounts.map(a => a.address));
    before(async () => {
        busdToken = await deployContract(
            admin,
            CROWDTokenArtifact,
            [
                "BUSD.CROWD.com", "BUSD", 10000000
            ]
        ) as CROWDToken;

        alphaToken = await deployContract(
            admin,
            CROWDTokenArtifact,
            [
                "alpha.CROWD.com", "ALP", 10000000
            ]
        ) as CROWDToken;

        crowdInvest = await deployContract(
            admin,
            CROWDInvestArtifact,
            [
            ]
        ) as CROWDInvest;
    });
    context('testing', async () => {

        async function testCreatePool(
            failed: boolean,
            id: BigNumberish,
            main_per_ticket: BigNumberish,
            main_token: string,
            total_amount: BigNumberish,
            ts_start_time: BigNumberish,
            ts_finish_time: number,
            state: BigNumberish
        ) {
            try {//fail test start > finish time
                await crowdInvest.createPool(id, main_per_ticket, main_token, total_amount, ts_start_time, ts_finish_time, state);
            } catch (error) {
                failed = !failed;

                // console.log((error as ContractError).reason);
                // console.log((error as ContractError).code);
                // console.log((error as ContractError).error);
                // console.log((error as ContractError).tx);

            } finally {
                assert.equal(failed, true);
            }
        }


        it('create pool  test', async () => {
            // function createPool(
            //     uint256 id,
            //     uint256 main_per_ticket,
            //     address main_token,
            //     uint256 total_amount,
            //     uint256 ts_start_time,
            //     uint256 ts_finish_time,
            //     uint256 state        
            var id = 1;
            var main_per_ticket = 10;
            var main_token = busdToken.address;
            var total_amount = decimal.mul(10000);
            var ts_start_time = Math.floor(Date.now() / 1000) + 10;
            var ts_finish_time = ts_start_time + 1000;
            var state = 0;

            //fail test start > finish time
            await testCreatePool(false, id, main_per_ticket, main_token, total_amount, ts_start_time, ts_finish_time - 1000, state);
            //fail total_amount == 0
            await testCreatePool(false, id, main_per_ticket, main_token, 0, ts_start_time, ts_finish_time, state);
            //fail main_token ''
            await testCreatePool(false, id, main_per_ticket, '', total_amount, ts_start_time, ts_finish_time, state);
            //fail main_per_ticket
            await testCreatePool(false, id, 0, main_token, total_amount, ts_start_time, ts_finish_time, state);

            await testCreatePool(true, id, main_per_ticket, main_token, total_amount, ts_start_time, ts_finish_time, state);
            //faile duplicate
            await testCreatePool(false, id, main_per_ticket, main_token, total_amount, ts_start_time, ts_finish_time, state);

            var poolInfo = await crowdInvest.getPool(id);
            assert.equal(poolInfo.main_per_ticket, main_per_ticket);
            assert.equal(poolInfo.main_token, main_token);
            assert.deepEqual(poolInfo.total_amount, total_amount);
            assert.equal(poolInfo.ts_start_time.toNumber(), ts_start_time);
            assert.equal(poolInfo.ts_finish_time.toNumber(), ts_finish_time);
            assert.equal(poolInfo.state.toNumber(), state);
            // console.log(poolInfo);
        });

        it('regist white list', async () => {
            // function registWhiteList(
            //     uint256 id,
            //     address[] memory users,
            //     uint256[] memory amounts
            var id = 1;
            var users: string[] = [];
            var amounts: BigNumber[] = [];
            users.push(admin.address);

            var failed = false;
            try {
                await crowdInvest.registWhiteList(id, users, amounts);
            } catch (error) {
                // console.log((error as ContractError).error);
                failed = true;
                // console.log((error as ContractError).tx);
            } finally {
                assert.equal(failed, true);
            }

            amounts.push(decimal);
            await crowdInvest.registWhiteList(id, users, amounts);

            var whiteList = await crowdInvest.getWhiteList(id);
            // console.log(whiteList);
            assert.deepEqual(whiteList[0], users);
            assert.deepEqual(whiteList[1], amounts);

        });
    });
});