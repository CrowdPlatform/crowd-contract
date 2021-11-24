
const CROWDToken = artifacts.require('CROWDToken');
const CROWDBridge = artifacts.require('CROWDBridge');


contract('CROWD, Bridge', (accounts, network) => {

    decimal = 10 ** 18;
    before(async () => {

        console.log(accounts);

        if(accounts[0] == '0x649b95c0a075c252E19b6BBbf88cc2e137298247')
        {
            this.crowd = await CROWDToken.at('0x194226FD672e3830A017cDd178F6cFbbfed98559');
            this.bridge = await CROWDBridge.at('0xD7EC11f170f75c77aE50BDA26B55892f0bd21561');    
            this.validator = '0xBBCaE96A030979529AE522064c893e15E4425054';
        }
        console.log('crowd : ' + this.crowd.address);
        console.log('bridge : ' + this.bridge.address);
    });

    it('token ', async () => {
        
        await this.bridge.resigtryMapEthBsc(this.crowd.address, '0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');        
        // await this.bridge.resigtryMapEthBsc(this.busd.address, this.crowd.address);        
        await this.bridge.setValidator(this.crowd.address, this.validator);

    });

});