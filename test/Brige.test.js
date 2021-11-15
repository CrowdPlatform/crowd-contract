
const  {ethers, Signer} = require('ethers');

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

        await this.bridge.resigtryMapEthBsc(this.crowd.address, this.crowd.address);

        await this.bridge.setValidator(this.crowd.address, accounts[0]);

        let allowance = await this.crowd.allowance.call(accounts[1], this.bridge.address);
        if(allowance.valueOf() == 0){
            console.log('approve unlimited');
            await this.crowd.approve(this.bridge.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935', {from: accounts[1]});
        }

        balance = await this.crowd.balanceOf.call(accounts[1]);
        console.log('account1 balance : '+balance.valueOf().toString());


        let transferToAmount = 1* decimal;
        //method id : 0x81b204c4
        await this.bridge.transferToNetwork(this.crowd.address, accounts[1], transferToAmount.toString(), 'ethereum', {from: accounts[1]});

        contract_address = accounts[0];//this.crowd.address;
        // let signer = accounts[1];

        // let msg = "transfer1"+signer+this.crowd.address+transferToAmount.toString();
        let packed_encode_js = web3.eth.abi.encodeParameters(['string', 'uint256'],['transfer', 1]);
        console.log(packed_encode_js);
        // let msg = web3.eth.accounts.hashMessage(web3.utils.utf8ToHex('ethereum'));
        // const prefix = '\x19Ethereum Signed Message:\n' + msg.length;
        // msg = prefix + msg;


        msg = await this.bridge.getHash("transfer", 1, contract_address, transferToAmount.toString());

        console.log(msg.length);
        console.log(msg);


        let messageHashBytes = ethers.utils.arrayify(msg);
        console.log(messageHashBytes);


        let eth_provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
        let signer  = new ethers.Wallet('0e514e34f179f41a7b21a5ca78d580411e3769c8a2c42b63ffbc6c4af4b3497d', eth_provider);
        // console.log(signer);
        
        // let sig = await signer.signMessage(msg);
        let sig = await signer.signMessage(messageHashBytes);
        console.log(sig);


        // // address contract_address, uint256 id, string memory from_network, bytes32 txhash,uint256 amount, bytes memory signature
        await this.bridge.confirm(contract_address, 1, "ethereum", '0x', transferToAmount.toString(), sig, {from: accounts[1]});
        // let feeAmount = transferToAmount * 0.005;
        // transferToAmount -= feeAmount;
        // await this.bridge.transferFromNetwork('eth', '0xffff', accounts[1], transferToAmount.toString(), this.crowd.address, feeAmount, {from: accounts[0]});

    });

});