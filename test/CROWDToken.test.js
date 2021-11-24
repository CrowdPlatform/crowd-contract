

const CROWDToken = artifacts.require('CROWDToken');
const CROWDStaking = artifacts.require('CROWDStaking');

contract('CROWD, Stacking, Ticket', (accounts, network) => {
    decimal = 10**18;
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
        
        balance = await this.crowd.balanceOf(accounts[1]);
        console.log('account1 balance : '+balance.valueOf().toString());

        var transfer_amount = 2*decimal;
        await this.crowd.transfer(accounts[1], transfer_amount.toString(), {from: accounts[0]});

        t_balance = await this.crowd.balanceOf(accounts[1]);
        t_balance -= balance;

        assert.equal(t_balance, transfer_amount);
    });

    it('staking test', async() =>{
        var stake_amount = 1*decimal;

        balance = await this.crowd.balanceOf(accounts[1]);
        console.log('account1 balance : '+balance.valueOf().toString());

        assert.equal(balance >= stake_amount, true);

        var allowance = await this.crowd.allowance(accounts[1], this.staking.address);
        if(allowance.valueOf() == 0){
            console.log('approve unlimited');
            await this.crowd.approve(this.staking.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935', {from: accounts[1]});
        }

        var already_staked = await this.staking.getStaking(accounts[1]);    
        await this.staking.stakeTokens(stake_amount.toString(), {from: accounts[1]});

        var confirm_stake = await this.staking.getStaking(accounts[1]);
        assert.equal(BigInt(confirm_stake), BigInt(already_staked) + BigInt(stake_amount));

        total_stake = await this.staking.totalStaking();
        console.log('total stake :'+total_stake.toString());

    });

    it('unstaking test', async() =>{
        stake_amount = await this.staking.getStaking(accounts[1]);
        console.log('stake amount : '+stake_amount.valueOf().toString());

        var unstake_amount = 0.5*decimal;
        console.log('unstake amount:'+unstake_amount.toString());
        await this.staking.unstakeTokens(unstake_amount.toString(), {from: accounts[1]});
        after_unstake = await this.staking.getStaking(accounts[1]);
        assert.equal(BigInt(after_unstake), BigInt(stake_amount) - BigInt(unstake_amount) )

        total_stake = await this.staking.totalStaking();
        console.log('total stake :'+total_stake.valueOf().toString());
    });

});