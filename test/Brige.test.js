
const CROWDToken = artifacts.require('CROWDToken');
const CROWDBridge = artifacts.require('CROWDBridge');


contract('CROWD, Bridge', (accounts, network) => {

    decimal = 10 ** 18;
    before(async () => {

        console.log(accounts);

        // if(accounts[0] == '0x649b95c0a075c252E19b6BBbf88cc2e137298247')
        // {
        //     this.crowd = await CROWDToken.at('0xD0E965eEFf32327ba1da95Ab342AC3683DF28dED');
        //     this.bridge = await CROWDBridge.at('0x291134a87B88546b3dc7c64edeeE59C23fF2c732');    
        // }
        // else
        {
            this.crowd = await CROWDToken.deployed();
            this.bridge = await CROWDBridge.deployed();
        }
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

    it('token transfer to network', async () => {

        contract_address = this.crowd.address;
        let signer = accounts[0];

        await this.bridge.resigtryMapEthBsc(contract_address, this.crowd.address);
        

        await this.bridge.setValidator(contract_address, signer);

        let allowance = await this.crowd.allowance.call(accounts[1], this.bridge.address);
        if(allowance.valueOf() == 0){
            console.log('approve unlimited');
            await this.crowd.approve(this.bridge.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935', {from: accounts[1]});
        }

        balance = await this.crowd.balanceOf.call(accounts[1]);
        console.log('account1 balance : '+balance.valueOf().toString());


        let transferToAmount = 1* decimal;
        //method id : 0x81b204c4
        let transferTo = await this.bridge.transferToNetwork(this.crowd.address, accounts[1], transferToAmount.toString(), 'ethereum', {from: accounts[1]});
        console.log(transferTo.tx);

        balance = await this.crowd.balanceOf.call(this.bridge.address);
        console.log('bridge balance : ' + balance.toString());


        let expired_at = 0;
        let id = 1;

        encode_packed = web3.utils.encodePacked("transferFromNetwork", 1, accounts[1], transferToAmount.toString(), contract_address, expired_at);
        console.log(encode_packed);

        msg_hashed =  web3.utils.soliditySha3(encode_packed);

        console.log(msg_hashed.length);
        console.log(msg_hashed);

        let sig = await web3.eth.sign(msg_hashed, signer);
        console.log(sig);


        let recover_signer = web3.eth.accounts.recover(msg_hashed, sig);

        assert.equal(recover_signer, signer);


        //Fail Test for change expired_at
        let failed = false;
        try {
            await this.bridge.transferFromNetwork(contract_address, id, "ethereum", transferTo.tx, transferToAmount.toString(), expired_at+1, sig, {from: accounts[1]});            
        } catch (error) {
            console.log(error.reason);
            failed = true;
        } finally{
            assert.equal(failed, true);
        }

        balance = await this.crowd.balanceOf.call(accounts[1]);
        console.log(balance.toString());

        await this.crowd.addMinters([this.bridge.address]);

        // // address contract_address, uint256 id, string memory from_network, bytes32 txhash,uint256 amount, bytes memory signature
        await this.bridge.transferFromNetwork(contract_address, id, "ethereum", transferTo.tx, transferToAmount.toString(), expired_at, sig, {from: accounts[1]});
        balance = await this.crowd.balanceOf.call(accounts[1]);
        console.log(balance.toString());
        assert.equal(balance, 2*decimal);

        //Fail Test for id
        failed = false;
        try {
            await this.bridge.transferFromNetwork(contract_address, id, "ethereum", transferTo.tx, transferToAmount.toString(), expired_at, sig, {from: accounts[1]});            
        } catch (error) {
            console.log(error.reason);
            failed = true;
        } finally{
            assert.equal(failed, true);
        }


        //Fail Test for invalid signer
        failed = false;
        try {
            await this.bridge.transferFromNetwork(contract_address, id+1, "ethereum", transferTo.tx, transferToAmount.toString(), expired_at, sig, {from: accounts[1]});            
        } catch (error) {
            console.log(error.reason);
            failed = true;
        } finally{
            assert.equal(failed, true);
        }

    });

});