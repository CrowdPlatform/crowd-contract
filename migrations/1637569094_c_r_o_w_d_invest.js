const CROWDInvest = artifacts.require('CROWDInvest');

module.exports = async function(_deployer, network, accounts) {
  // Use deployer to state migration tasks.
  console.log('deploy crowd invest contract');


  if(network == 'bscTestnet')  {
    return;    
  }

  _deployer.then(async function(){
    token = await _deployer.deploy(CROWDInvest);
  });
};
