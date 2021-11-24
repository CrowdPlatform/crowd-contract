
const CROWDToken = artifacts.require('CROWDToken');
const CROWDBridge = artifacts.require('CROWDBridge');


contract('CROWD, Bridge', (accounts, network) => {

    decimal = 10 ** 18;
    before(async () => {

        console.log(accounts);

        if(accounts[0] == '0x649b95c0a075c252E19b6BBbf88cc2e137298247')
        {
            this.crowd = await CROWDToken.at('0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');
            this.bridge = await CROWDBridge.at('0xBb3f0d89b6DcC11630Edff82A455470Ecf676B02');    
            this.busd = await CROWDToken.at('0x86dDC7e76bD30fEA987380f8C5C2bE4a5B43A42C');
            this.validator = '0xBBCaE96A030979529AE522064c893e15E4425054';
        }
        console.log('crowd : ' + this.crowd.address);
        console.log('bridge : ' + this.bridge.address);
    });

    it('token transfer to network', async () => {
        
        // await this.bridge.resigtryMapEthBsc(this.crowd.address, this.busd.address);        
        // await this.bridge.resigtryMapEthBsc(this.busd.address, this.crowd.address);        

        // await this.bridge.setValidator(this.crowd.address, this.validator);

    });

});