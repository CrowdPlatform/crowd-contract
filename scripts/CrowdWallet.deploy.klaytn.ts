const Caver = require("caver-js");


let tokenContract;
import * as Wallet from "../artifacts/contracts/IDOWallet.sol/IDOWallet.json";

var chainId = 8217;
const caver = new Caver(`${process.env.CYPRESS_URL}`);
var WalletAddress = process.env.WalletAddress || "";
var contract: any;
var keyring: any;
var account_privatekeys = JSON.parse(process.env.privatekeys_main || "[]");

async function deployed() {
    keyring = caver.wallet.keyring.createFromPrivateKey(account_privatekeys[0]);
    console.log(keyring.address);
    caver.wallet.add(keyring);

    contract = new caver.contract(Wallet.abi);
    if (WalletAddress === "") {
        var deployed = await contract
            .deploy({
                data: Wallet.bytecode,
            })
            .send({
                from: keyring.address,
                gas: "0x4bfd200",
            });

        console.log(deployed._address);
        WalletAddress = deployed._address;
        contract = deployed;
    } else {
        contract.options.address = WalletAddress;
    }

    return contract;
}
async function main() {

    var tokenAddress: string;

    var validatorAddress = process.env.VALIDATOR || "";
    var recieverAddress = process.env.RECIEVER || "";

    if (recieverAddress.length === 0) {
        console.log("reciverAddress is not set");
        return;
    }
    if (validatorAddress.length === 0) {
        console.log("validatorAddress is not set");
        return;
    }

    switch (chainId) {
        case 1: //ethereum
            tokenAddress = process.env.TICKET_ADDRESS_ETH || "";
            break;
        case 56: //bsc
            tokenAddress = process.env.TICKET_ADDRESS_BNB || "";
            break;
        case 3: //ropsten
            tokenAddress = process.env.TICKET_ADDRESS_ROPSTEN || "";
            break;
        case 97: //bsc testnet
            tokenAddress = process.env.TICKET_ADDRESS_BNBT || "";
            break;
        case 1001: //baobab
            tokenAddress = process.env.TICKET_ADDRESS_BAOBAB || "";
            // idoWallet = await ethers.getContractAt("IDOWallet", process.env.BAOBAB_WALLET || "");
            break;
        case 8217: //baobab
            tokenAddress = process.env.TICKET_ADDRESS_CYPRESS || "";
            // idoWallet = await ethers.getContractAt("IDOWallet", process.env.BAOBAB_WALLET || "");
            break;
        default:
            console.log(chainId);
            return;
    }

    const contract = await deployed();

try {
    await contract.methods.setReciever(recieverAddress).send({
        from: keyring.address,
        gas: 10000000,
    });
} catch (err: any) {
    console.error(err);
}
}

main().catch((error)=>{
    console.error(error);
    process.exitCode = 1;
});
