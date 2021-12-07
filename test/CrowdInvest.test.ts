
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
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { fail } from "assert";
import exp from "constants";
import { task } from "hardhat/config";

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
            var ts_start_time = Math.floor(Date.now() / 1000) + 5;
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
            users.push(test1.address);

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

            amounts.push(BigNumber.from(100));
            await crowdInvest.registWhiteList(id, users, amounts);

            var whiteList = await crowdInvest.getWhiteList(id);
            // console.log(whiteList);
            assert.deepEqual(whiteList[0], users);
            assert.deepEqual(whiteList[1], amounts);

        });
        function delay(interval: number) {
            return it('delay', done => {
                setTimeout(() => done(), interval)
            }).timeout(interval + 100);
        }
        async function testInvestPool(failed: boolean, test: string | Provider | Signer, id: BigNumberish, amount: BigNumberish) {
            try {
                // function investPool(uint256 invest_id, uint256 amount) public
                await crowdInvest.connect(test).investPool(id, amount);
            } catch (error) {
                if(failed)
                    console.log((error as ContractError).error);
                failed = !failed;
            } finally {
                expect(failed).equal(true);
            }
        }

        var receiver = accounts[5].address;
        var busd_transfer = decimal.mul(2000);
        it('invest pool fail before start', async () => {
            var approve_amount = decimal.mul(5000);

            await crowdInvest.setReciever(receiver);
            await busdToken.transfer(test1.address, busd_transfer);
            await busdToken.connect(test1).approve(crowdInvest.address, approve_amount);

            expect(await crowdInvest.getReciver()).equal(receiver);

            // await testInvestPool(false, test1, 1, decimal);
        });
        delay(2000);

        it('invest pool', async () => {


            var id = 1;
            var invest_amount = BigNumber.from((1001 * 10 ** 16).toString());


            var poolInfo = await crowdInvest.getPool(id);
            var main_per_ticket = poolInfo.main_per_ticket;

            var old_whiteList = await crowdInvest.getWhiteList(id);
            var idx = 0;
            for (; idx < old_whiteList[0].length; idx++)
                if (old_whiteList[0][idx] === test1.address) break;


            await testInvestPool(false, test1, id, poolInfo.total_amount.add(1));

            await testInvestPool(false, test1, id+1, invest_amount);

            await testInvestPool(false, test1, id, old_whiteList[1][idx].mul(main_per_ticket).mul(decimal).add(1));

            await testInvestPool(true, test1, id, invest_amount);

            var use_ticket = invest_amount.div(decimal).div(main_per_ticket).toNumber();
            // console.log(invest_amount.toString())
            if (invest_amount.mod(decimal.mul(main_per_ticket)).eq(0) == false)
                use_ticket++;

            // console.log(invest_amount.toString())

            expect(await busdToken.balanceOf(receiver)).deep.equal(invest_amount);
            expect(await busdToken.balanceOf(test1.address)).deep.equal(busd_transfer.sub(invest_amount));

            var new_whiteList = await crowdInvest.getWhiteList(id);
            expect(old_whiteList[1][idx].toNumber() - new_whiteList[1][idx].toNumber()).eq(use_ticket);

        });
    });
});