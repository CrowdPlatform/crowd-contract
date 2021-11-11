

const CROWDToken = artifacts.require('CROWDToken');
const CROWDStaking = artifacts.require('CROWDStaking');

contract('CROWD, Stacking, Ticket', (accounts, network) => {
    before(async () => {

        console.log(accounts);

        if(accounts[0] == '0x649b95c0a075c252E19b6BBbf88cc2e137298247')
        {
            this.crowd = await CROWDToken.at('0xD0E965eEFf32327ba1da95Ab342AC3683DF28dED');
            this.staking = await CROWDStaking.at('0x291134a87B88546b3dc7c64edeeE59C23fF2c732');    
        }
        else{
            this.crowd = await CROWDToken.deployed();
            this.staking = await CROWDStaking.deployed();
        }
        console.log('crowd : ' + this.crowd.address);
        console.log('stake : ' + this.staking.address);
    });

    it('token transfer test', async () => {
        
        balance = await this.crowd.balanceOf.call(accounts[1]);
        console.log('account1 balance : '+balance.valueOf().toString());

        let transfer_amount = 2000000000000000000;
        await this.crowd.transfer(accounts[1], transfer_amount.toString(), {from: accounts[0]});

        t_balance = await this.crowd.balanceOf.call(accounts[1]);
        t_balance -= balance;

        assert.equal(t_balance, transfer_amount);
    });

    it('token transfer to network', async () => {

        let transferToAmount = 1000000000000000000;
        //method id : 0x81b204c4
        await this.crowd.transferToNetwork(accounts[1], transferToAmount.toString(), 'ethereum', {from: accounts[1]});


        let feeAmount = transferToAmount * 0.005;
        transferToAmount -= feeAmount;
        await this.crowd.transferFromNetwork('eth', '0xffff', accounts[1], transferToAmount.toString(), this.crowd.address, feeAmount, {from: accounts[0]});

    });


    it('staking test', async() =>{
        let stake_amount = 1000000000000000000;

        balance = await this.crowd.balanceOf.call(accounts[1]);
        console.log('account1 balance : '+balance.valueOf().toString());

        assert.equal(balance >= stake_amount, true);

        let allowance = await this.crowd.allowance.call(accounts[1], this.staking.address);
        if(allowance.valueOf() == 0){
            console.log('approve unlimited');
            await this.crowd.approve(this.staking.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935', {from: accounts[1]});
        // await this.crowd.increaseAllowance(this.staking.address, stake_amount.toString(), {from: accounts[1]});
        }

        already_staked = await this.staking.getStaking.call(accounts[1]);    
        await this.staking.stakeTokens(stake_amount.toString(), {from: accounts[1]});

        confirm_stake = await this.staking.getStaking.call(accounts[1]);
        // assert.equal(confirm_stake.valueOf(), already_staked.valueOf() + stake_amount.valueOf());

        // console.log(confirm_stake.valueOf().toString())
        total_stake = await this.staking.totalStaking.call();
        console.log('total stake :'+total_stake.valueOf().toString());

    });

    it('unstaking test', async() =>{
        confirm_stake = await this.staking.getStaking.call(accounts[1]);
        console.log('stake amount : '+confirm_stake.valueOf().toString());

        let unstake_amount = 1000000000000000000;
        await this.staking.unstakeTokens(unstake_amount.toString(), {from: accounts[1]});


        total_stake = await this.staking.totalStaking.call();
        console.log('total stake :'+total_stake.valueOf().toString());
    });

});