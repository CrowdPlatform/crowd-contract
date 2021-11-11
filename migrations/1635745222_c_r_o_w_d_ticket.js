
const CROWDTicket = artifacts.require('CROWDTicket');


module.exports = function(_deployer, network, accounts) {
  // Use deployer to state migration tasks.

  console.log('deploy ticket contract');

  if(network == 'bscTestnet')  {
    return;
  }
  _deployer.then(async function(){
    return _deployer.deploy(CROWDTicket, 1000000, {from: accounts[0]});
  });
};