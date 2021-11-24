const CROWDToken = artifacts.require('CROWDToken');
const CROWDStaking = artifacts.require('CROWDStaking');
const CROWDTicket = artifacts.require('CROWDTicket');
const CROWDBridge = artifacts.require('CROWDBridge');

module.exports = async function(_deployer, network, accounts) {
  // Use deployer to state migration tasks.
  // let ownerAddress = web3.eth.accounts[0];
  console.log('deploy CROWDToken, CROWDStaking, CROWDBridge contract');


  if(network === 'bscTestnet')  {
    console.log(process.env.BSCTestnetNew);

    if(process.env.BSCTestnetNew === 'true')
    {
      this.crowd = await CROWDToken.at('0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');
      this.bridge = await CROWDBridge.at('0xBb3f0d89b6DcC11630Edff82A455470Ecf676B02');    
      // token = await _deployer.deploy(CROWDToken, "CROWD.com", "CWD", 10000000);
      // await _deployer.deploy(CROWDBridge, 1);  
    }
    return;    
  }
  else if(network === 'ropsten'){
    // await _deployer.deploy(CROWDBridge, 1);  
    return;
  }

  _deployer.then(async function(){
    token = await _deployer.deploy(CROWDToken, "CROWD.com", "CWD", 10000000);
    stake = await _deployer.deploy(CROWDStaking, token.address);
    await _deployer.deploy(CROWDBridge, 1);
        // console.log(stake.address);
        // console.log(token.address);
  });//0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f
  //0xBb3f0d89b6DcC11630Edff82A455470Ecf676B02
};
