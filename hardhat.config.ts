import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { json } from "stream/consumers";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }

});

task("testArg", async(args, hre)=>{

  console.log(args);
  console.log(hre.network.name);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: JSON.parse(process.env.privatekeys === undefined ? "[]" : process.env.privatekeys)
    },
    bscTestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: JSON.parse(process.env.privatekeys === undefined ? "[]" : process.env.privatekeys),
      hardfork: "byzantium"

      // network_id: 97,
      // confirmations: 0,
      // timeoutBlocks: 200,
      // skipDryRun: true
    },        
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || process.env.BSCSCANAPIKEY,
  },
};

export default config;
