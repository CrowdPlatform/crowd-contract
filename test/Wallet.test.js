
const CROWDToken = artifacts.require('CROWDToken');
const CROWDTicket = artifacts.require('CROWDTicket');
const IDOWallet = artifacts.require('IDOWallet');


contract('CROWD, Wallet', (accounts, network) => {

    decimal = 10 ** 18;
    var signer = accounts[2];
    var crowd_address;
    var ticket_address;

    before(async () => {

        this.crowd = await CROWDToken.deployed();
        this.ticket = await CROWDTicket.deployed();
        this.wallet = await IDOWallet.deployed();

        console.log('crowd : ' + this.crowd.address);
        console.log('ticket : ' + this.ticket.address);
        console.log('wallet : ' + this.wallet.address);

        crowd_address = this.crowd.address;
        ticket_address = this.ticket.address;

        await this.wallet.setValidator(crowd_address, signer);
        await this.wallet.setValidator(ticket_address, signer);
    });

    it('wallet invest test', async () => {

        deposit = await this.wallet.depositsOf(crowd_address);        
        console.log(deposit.toString());

        deposit_amount = 1*decimal;
        var failed = false;
        //fail test : ERC20: transfer amount exceeds balance
        try{
            await this.wallet.depositForSale(crowd_address, deposit_amount.toString(), {from:accounts[1]});
        }catch(err){
            console.log(err.reason);
            failed = true;
        }finally{
            assert.equal(failed, true);
        }

        await this.crowd.transfer(accounts[1], deposit_amount.toString(), {from:accounts[0]});
        let allowance = await this.crowd.allowance(accounts[1], this.wallet.address);
        if(allowance.valueOf() == 0){
            console.log('approve unlimited');
            await this.crowd.approve(this.wallet.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935', {from: accounts[1]});
        }

        await this.wallet.depositForSale(crowd_address, deposit_amount.toString(), {from:accounts[1]});

        
        //verify("claimIDO", id, msg.sender, amount, contract_address, expired_at, _validator, signature);
        id = 1
        sender = accounts[4];
        amount = 1*decimal;
        expired_at = 0;
        encode_packed = web3.utils.encodePacked("claimIDO", id, sender, amount.toString(), crowd_address, expired_at);
        msg_hashed =  web3.utils.soliditySha3(encode_packed);
        let sig = await web3.eth.sign(msg_hashed, signer);
        let recover_signer = web3.eth.accounts.recover(msg_hashed, sig);

        //claimIDO(address contract_address, uint256 amount, uint256 id, uint256 expired_at, bytes memory signature) public
        await this.wallet.claimIDO(crowd_address, amount.toString(), id, expired_at.toString(), sig, {from:sender});

        balance = await this.crowd.balanceOf(sender);
        console.log(balance.toString());

        assert.equal(balance, amount);
    });

    it('wallet ticket test', async () => {
        //function withdrawTicket(uint256 amount, uint256 id, uint256 expired_at, bytes memory signature) public
        //verify("withdrawTicket", id, msg.sender, amount, address(this), expired_at, getValidator(address(this)), signature);
    });
});