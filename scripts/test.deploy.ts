import { ethers, waffle } from "hardhat";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

var accounts: SignerWithAddress[];

async function main() {
    accounts = await ethers.getSigners();
    var network = await ethers.provider.getNetwork();

    console.log(network);
}

main()
    .then(() => process.exit(0))
    .catch(console.error);
