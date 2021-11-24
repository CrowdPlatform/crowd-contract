const CROWDToken = artifacts.require('CROWDToken');
const CROWDStaking = artifacts.require('CROWDStaking');

module.exports = async function(_deployer, network, accounts) {
  // Use deployer to state migration tasks.
  // let ownerAddress = web3.eth.accounts[0];
  console.log('deploy CROWDStaking contract');


  if(network === 'bscTestnet')  {
    console.log(process.env.BSCTestnetNew);

    // if(process.env.BSCTestnetNew === 'true')
    {
      this.crowd = await CROWDToken.at('0x7011A750e85DfCDd7a5f334897E7Ea9cFe40Ed5f');
      this.stake = await _deployer.deploy(CROWDStaking, this.crowd.address);
    }
    return;    
  }
  else if(network === 'ropsten'){
    return;
  }
};
