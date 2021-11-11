
const CROWDStaking = artifacts.require('CROWDStaking');
const CROWDToken = artifacts.require('CROWDToken');

module.exports = async function(_deployer, network, accounts) {
  // Use deployer to state migration tasks.
  console.log('deploy staking contract');

  if(network == 'bscTestnet')  {
    // let deployed_staking = await CROWDStaking.at('0x9499d7274c73AF7CfC1b1EBA5ABba6C856f8BD17');
    // // let deployed_staking = await CROWDStaking.deployed();
    // if(deployed_staking){
    //   console.log('alreday deployed :' + deployed_staking.address);
    //   return;
    // }
    // _deployer.then(async function(){
    //   const crowd = await CROWDToken.deployed();
    //   return _deployer.deploy(CROWDStaking, crowd.address, {overwrite:false, from:accounts[0]}).then(async function(stake){
    //       console.log(stake.address);
    //   })
    // });
    return;
  }
  _deployer.then(async function(){
    const crowd = await CROWDToken.deployed();
    // console.log(crowd.address);
    return _deployer.deploy(CROWDStaking, crowd.address).then(async function(stake){
        // console.log(stake.address);
    })
  });
};
