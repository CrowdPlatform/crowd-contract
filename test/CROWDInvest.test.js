
const CROWDToken = artifacts.require('CROWDToken');
const CROWDTicket = artifacts.require('CROWDTicket');
const CROWDInvest = artifacts.require('CROWDInvest');


contract('CROWD, Wallet', (accounts, network) => {

    decimal = 10 ** 18;
    before(async () => {

        this.crowd = await CROWDToken.deployed();
        this.invest = await CROWDInvest.deployed();

        console.log('crowd : ' + this.crowd.address);
        console.log('invest : ' + this.invest.address);
    });

    it('token transfer test', async () => {
        
        balance = await this.crowd.balanceOf.call(accounts[1]);

        let transfer_amount = 2 * decimal;
        await this.crowd.transfer(accounts[1], transfer_amount.toString(), {from: accounts[0]});

        t_balance = await this.crowd.balanceOf.call(accounts[1]);
        t_balance -= balance;

        assert.equal(t_balance, transfer_amount);
    });

    it('create pool test', async () => {
        var id = 1;
        var invest_token = this.crowd.address;
        var invest_rate = 100; // n / 10000
        var main_token = this.crowd.address;
        var total_amount = 100*decimal;
        var start = Math.floor(Date.now()/1000);
        var finish = start + 3600;

        console.log('start : '+start);
        await this.invest.createPool(id, invest_token, invest_rate, main_token, total_amount.toString(), start, finish, {from: accounts[0]});
        console.log('success create pool');
        //fail test for duplicate id
        var failed = false;
        try {
            await this.invest.createPool(id, invest_token, invest_rate, main_token, total_amount.toString(), start, finish, {from: accounts[0]});            
        } catch (error) {
            failed = true;
        } finally{
            assert.equal(failed , true);
        }
    });

});