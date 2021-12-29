import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import { CROWDToken } from "../typechain/CROWDToken";
import { CROWDStaking } from "../typechain/CROWDStaking";
import { BigNumber } from "@ethersproject/bignumber";

describe("CROWD, Stacking, Ticket", () => {
    let crowdToken: CROWDToken;
    let crowdStaking: CROWDStaking;

    const provider = waffle.provider;

    const [admin, test1] = provider.getWallets();
    const decimal = BigNumber.from((10 ** 18).toString());

    before(async () => {
        let factory = await ethers.getContractFactory("CROWDToken");
        crowdToken = await factory.deploy("CROWD.com", "CWD", 10000000);

        let factory2 = await ethers.getContractFactory("CROWDStaking");
        crowdStaking = await factory2.deploy();
        await crowdStaking.setToken(crowdToken.address);
    });

    context("full test", async () => {
        it("token mint/buring test", async () => {
            await crowdToken.connect(admin).addMinters([admin.address]);
            let failed = false;
            try {
                await crowdToken.connect(admin).mint(admin.address, "1");
            } catch (error) {
                failed = true;
            } finally {
                expect(failed).equal(true);
            }
            await crowdToken.connect(admin).burn("1");
            await crowdToken.totalSupply().then(console.log);
            await crowdToken.connect(admin).mint(admin.address, "1");
            await crowdToken.totalSupply().then(console.log);
        });

        it("token transfer test", async () => {
            expect(await crowdToken.name()).equal("CROWD.com");
            expect(await crowdToken.symbol()).equal("CWD");

            let balance = await crowdToken.balanceOf(test1.address);
            console.log("test1 balance : " + balance.valueOf().toString());

            var transfer_amount = decimal.mul(2);
            await crowdToken.transfer(test1.address, transfer_amount.toString());

            var t_balance = await crowdToken.balanceOf(test1.address);
            expect(t_balance.sub(balance).toString()).to.be.equal(transfer_amount.toString());
        });

        it("staking test", async () => {
            var stake_amount = decimal.mul(1);
            var balance = await crowdToken.balanceOf(test1.address);
            console.log("test1 balance : " + balance.valueOf());

            assert.equal(balance.gte(stake_amount), true);

            var allowance = await crowdToken.allowance(test1.address, crowdStaking.address);
            if (allowance.valueOf() == 0) {
                console.log("approve unlimited : " + crowdStaking.address);
                await crowdToken.connect(test1).approve(crowdStaking.address, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
            }

            var already_staked = await crowdStaking.stakingBalance(test1.address);
            await crowdStaking.connect(test1).stakeTokens(stake_amount);

            var confirm_stake = await crowdStaking.stakingBalance(test1.address);
            assert.equal(confirm_stake.eq(already_staked.add(stake_amount)), true);

            var total_stake = await crowdStaking.totalStaking();
            console.log("total stake :" + total_stake.toString());
        });

        it("unstaking test", async () => {
            var stake_amount = await crowdStaking.stakingBalance(test1.address);
            console.log("stake amount : " + stake_amount.valueOf());

            var unstake_amount = stake_amount.div(2);
            console.log("unstake amount:" + unstake_amount.toString());
            await crowdStaking.connect(test1).unstakeTokens(unstake_amount.toString());
            var after_unstake = await crowdStaking.stakingBalance(test1.address);
            assert.equal(after_unstake.eq(stake_amount.sub(unstake_amount)), true);

            var total_stake = await crowdStaking.totalStaking();
            console.log("total stake :" + total_stake.valueOf());
        });
    });
});
