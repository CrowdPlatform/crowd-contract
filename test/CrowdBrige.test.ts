
import {ethers, waffle} from "hardhat";
import {expect, assert} from "chai";

import CROWDTokenArtifact from '../artifacts/contracts/CROWDToken.sol/CROWDToken.json';
import CROWDBridgeArtifact from '../artifacts/contracts/CROWDBridge.sol/CROWDBridge.json';
import { CROWDToken  } from '../typechain/CROWDToken';
import { CrowdBridge  } from '../typechain/CrowdBridge';
import { BigNumber } from "@ethersproject/bignumber";
import Web3 from 'Web3';
import { hashMessage } from "@ethersproject/hash";

const {deployContract} = waffle;


describe('CROWD, Bridge', () => {

    let crowdToken: CROWDToken;
    let crowdBridge: CrowdBridge;

    const provider = waffle.provider;

    const [admin, test1] = provider.getWallets();
    const decimal = BigNumber.from((10**18).toString());

    before(async () => {
        crowdToken = await deployContract(
            admin,
            CROWDTokenArtifact,
            [
                "CROWD.com", "CWD", 10000000
            ]            
        ) as CROWDToken;

        crowdBridge = await deployContract(
            admin,
            CROWDBridgeArtifact,
            [
                crowdToken.address
            ]            
        ) as CrowdBridge;
    });
    it('token transfer test', async () => {
        
        var balance = await crowdToken.balanceOf(test1.address);

        let transfer_amount = decimal.mul(2);
        await crowdToken.connect(admin).transfer(test1.address, transfer_amount.toString());

        var t_balance = await crowdToken.balanceOf(test1.address);
        t_balance = t_balance.sub(balance);

        assert.equal(t_balance.sub(transfer_amount).eq(0), true);
    });

    it('token transfer to network', async () => {

        var contract_address = crowdToken.address;
        let signer = admin;

        await crowdBridge.resigtryMapEthBsc(contract_address, crowdToken.address);
        

        await crowdBridge.setValidator(contract_address, signer.address);

        let allowance = await crowdToken.allowance(test1.address, crowdBridge.address);
        if(allowance.valueOf() == 0){
            console.log('approve unlimited');
            await crowdToken.connect(test1).approve(crowdBridge.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
        }

        var balance = await crowdToken.balanceOf(test1.address);
        console.log('account1 balance : '+balance.valueOf().toString());


        let transferToAmount = decimal;
        //method id : 0x81b204c4
        let transferTo = await crowdBridge.connect(test1).transferToNetwork(crowdToken.address, test1.address, transferToAmount.toString(), 'ethereum');
        console.log(transferTo.hash);

        balance = await crowdToken.balanceOf(crowdBridge.address);
        console.log('bridge balance : ' + balance.toString());


        let expired_at = 0;
        let id = 1;

        var encoded_packed = ethers.utils.solidityPack(['string', 'uint256', 'address', 'uint256', 'address', 'uint256']
        ,["transferFromNetwork", 1, test1.address, transferToAmount, contract_address, expired_at]);
        console.log(encoded_packed);
        var msg_hashed = ethers.utils.keccak256(encoded_packed);

        console.log(msg_hashed.length);
        console.log(msg_hashed);

        var msgBytes = ethers.utils.arrayify(msg_hashed);
        // console.log(msgBytes.length);
        // console.log(msgBytes);


        var sig = await signer.signMessage(msgBytes);
        console.log(sig);


        var recover_signer = ethers.utils.recoverAddress(hashMessage(msgBytes), sig);
        assert.equal(recover_signer, signer.address);

        //Fail Test for change expired_at
        var failed = false;
        try {
            await crowdBridge.connect(test1).transferFromNetwork(contract_address, id, "ethereum", transferTo.hash, transferToAmount.toString(), expired_at+1, sig);            
        } catch (error) {
            console.log((error as Error).message);
            failed = true;
        } finally{
            assert.equal(failed, true);
        }

        balance = await crowdToken.balanceOf(test1.address);
        console.log(balance.toString());

        await crowdToken.addMinters([crowdBridge.address]);

        // // address contract_address, uint256 id, string memory from_network, bytes32 txhash,uint256 amount, bytes memory signature
        await crowdBridge.connect(test1).transferFromNetwork(contract_address, id, "ethereum", transferTo.hash, transferToAmount.toString(), expired_at, sig);
        balance = await crowdToken.balanceOf(test1.address);
        console.log(balance.toString());
        assert.equal(balance.sub(decimal.mul(2)).eq(0), true);

        //Fail Test for id
        failed = false;
        try {
            await crowdBridge.connect(test1).transferFromNetwork(contract_address, id, "ethereum", transferTo.hash, transferToAmount.toString(), expired_at, sig);            
        } catch (error) {
            console.log((error as Error).message);
            failed = true;
        } finally{
            assert.equal(failed, true);
        }


        //Fail Test for invalid signer
        failed = false;
        try {
            await crowdBridge.connect(test1).transferFromNetwork(contract_address, id+1, "ethereum", transferTo.hash, transferToAmount.toString(), expired_at, sig);            
        } catch (error) {
            console.log((error as Error).message);
            failed = true;
        } finally{
            assert.equal(failed, true);
        }

    });

});