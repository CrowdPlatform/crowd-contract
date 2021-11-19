
const CROWDToken = artifacts.require('CROWDToken');
const CROWDTicket = artifacts.require('CROWDTicket');
const IDOWallet = artifacts.require('IDOWallet');


contract('CROWD, Wallet', (accounts, network) => {

    decimal = 10 ** 18;
    before(async () => {

        this.crowd = await CROWDToken.deployed();
        this.wallet = await IDOWallet.deployed();

        console.log('crowd : ' + this.crowd.address);
        console.log('bridge : ' + this.bridge.address);
    });

    it('token transfer test', async () => {
        
        balance = await this.crowd.balanceOf.call(accounts[1]);

        let transfer_amount = 2 * decimal;
        await this.crowd.transfer(accounts[1], transfer_amount.toString(), {from: accounts[0]});

        t_balance = await this.crowd.balanceOf.call(accounts[1]);
        t_balance -= balance;

        assert.equal(t_balance, transfer_amount);
    });
});