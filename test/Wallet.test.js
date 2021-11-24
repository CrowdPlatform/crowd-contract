
const CROWDToken = artifacts.require('CROWDToken');
const CROWDTicket = artifacts.require('CROWDTicket');
const IDOWallet = artifacts.require('IDOWallet');


contract('CROWD, Wallet', (accounts, network) => {

    decimal = 10 ** 18;
    var signer = accounts[2];
    
    before(async () => {

        this.crowd = await CROWDToken.deployed();
        this.ticket = await CROWDTicket.deployed();
        this.wallet = await IDOWallet.deployed();

        console.log('crowd : ' + this.crowd.address);
        console.log('ticket : ' + this.ticket.address);
        console.log('wallet : ' + this.wallet.address);


    });

    it('wallet test', async () => {
        contract_address = this.crowd.address;

        await this.wallet.setValidator(contract_address, signer);

        deposit = await this.wallet.depositsOf(contract_address);        
        console.log(deposit.toString());

        deposit_amount = 1*decimal;
        var failed = false;
        //fail test : ERC20: transfer amount exceeds balance
        try{
            await this.wallet.depositForSale(contract_address, deposit_amount.toString(), {from:accounts[1]});
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

        await this.wallet.depositForSale(contract_address, deposit_amount.toString(), {from:accounts[1]});

        
        //verify("claimIDO", id, msg.sender, amount, contract_address, expired_at, _validator, signature);
        id = 1
        sender = accounts[1];
        amount = 1*decimal;
        expired_at = 0;
        encode_packed = web3.utils.encodePacked("claimIDO", id, accounts[1], amount.toString(), contract_address, expired_at);
        msg_hashed =  web3.utils.soliditySha3(encode_packed);
        let sig = await web3.eth.sign(msg_hashed, signer);
        let recover_signer = web3.eth.accounts.recover(msg_hashed, sig);
        console.log(recover_signer);
        console.log(signer);

        //claimIDO(address contract_address, uint256 amount, uint256 id, uint256 expired_at, bytes memory signature) public
        await this.wallet.claimIDO(contract_address, amount.toString(), id, expired_at.toString(), sig, {from:accounts[1]});
    });
});