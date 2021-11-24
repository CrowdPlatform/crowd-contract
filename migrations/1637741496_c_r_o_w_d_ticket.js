
const CROWDTicket = artifacts.require('CROWDTicket');

module.exports = async function(_deployer, network, accounts) {
  // Use deployer to state migration tasks.
  // let ownerAddress = web3.eth.accounts[0];
  console.log('deploy CROWDTicket contract');


  if(network === 'bscTestnet')  {
    console.log(process.env.BSCTestnetNew);

    if(process.env.BSCTestnetNew === 'true')
    {
      await _deployer.deploy(CROWDTicket, 1000000);
    }
    return;    
  }
  else if(network === 'ropsten'){
    return;
  }

  await _deployer.deploy(CROWDTicket, 1000000);

};
