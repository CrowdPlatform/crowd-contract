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

task("testArg", async (args, hre) => {
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
            accounts: JSON.parse(process.env.privatekeys === undefined ? "[]" : process.env.privatekeys),
        },
        bscTestnet: {
            url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
            accounts: JSON.parse(process.env.privatekeys === undefined ? "[]" : process.env.privatekeys),
        },
        baobab: {
            url: process.env.BAOBAB_URL || "",
            accounts: JSON.parse(process.env.privatekeys === undefined ? "[]" : process.env.privatekeys),
        },
        mumbai: {
            url: `https://rpc-mumbai.matic.today`,
            accounts: JSON.parse(process.env.privatekeys === undefined ? "[]" : process.env.privatekeys),
        },

        bsc: {
            url: `https://bsc-dataseed.binance.org/`,
            accounts: JSON.parse(process.env.privatekeys_main === undefined ? "[]" : process.env.privatekeys_main),
        },
        eth: {
            url: process.env.ETH_URL || "",
            accounts: JSON.parse(process.env.privatekeys_main === undefined ? "[]" : process.env.privatekeys_main),
        },
        cypress: {
            url: process.env.CYPRESS_URL || "",
            accounts: JSON.parse(process.env.privatekeys_main === undefined ? "[]" : process.env.privatekeys_main),
        },
        polygon: {
            url: process.env.POLYGON_URL || "",
            accounts: JSON.parse(process.env.privatekeys_main === undefined ? "[]" : process.env.privatekeys_main),
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
        // apiKey: process.env.BSCSCANAPIKEY,
        // apiKey: process.env.POLYGONSCAN_API_KEY,
    },
};

export default config;
