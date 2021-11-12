const CROWDToken = artifacts.require('CROWDToken');
const CROWDStaking = artifacts.require('CROWDStaking');
const CROWDTicket = artifacts.require('CROWDTicket');

module.exports = async function(_deployer, network, accounts) {
  // Use deployer to state migration tasks.
  // let ownerAddress = web3.eth.accounts[0];
  console.log('deploy crowd token contract');


  if(network == 'bscTestnet')  {
    // let deployed_token = await CROWDToken.at('0xad70ee95722cddbb1da996112317618034f11a15');
    // // let deployed_token = await CROWDToken.deployed();
    // if(deployed_token) 
    // {
    //   console.log('alreday deployed :' + deployed_token.address);
    //   return;
    // }
    // _deployer.then(function(){
    //   return _deployer.deploy(CROWDToken, 10000000, {overwrite:false, from:accounts[0]}).then(async function(token){
  
    //       console.log(token.address);
    //   })
    // });
    return;    
  }

  _deployer.then(async function(){
    token = await _deployer.deploy(CROWDToken, 10000000);
    stake = await _deployer.deploy(CROWDStaking, token.address);
        // console.log(stake.address);
        // console.log(token.address);
  });
};
