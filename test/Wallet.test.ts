
import { ethers, waffle } from "hardhat";
import { expect, assert } from "chai";

import { CROWDToken } from '../typechain/CROWDToken';
import { IDOWallet } from '../typechain/IDOWallet';
import { BigNumber } from "@ethersproject/bignumber";
import { hashMessage } from "ethers/lib/utils";


describe('CROWD, Wallet', () => {
    let crowdToken: CROWDToken;
    let ticketToken: CROWDToken;
    let idoWallet: IDOWallet;


    const provider = waffle.provider;

    const accounts = provider.getWallets();
    const decimal = BigNumber.from((10 ** 18).toString());
    const tester = accounts[1];
    const signer = accounts[2];
    const receiver = accounts[3];

    before(async () => {
        let factory = await ethers.getContractFactory("CROWDToken");
        crowdToken = await factory.deploy("CROWD.com", "CWD", 10000000);
        let factory2 = await ethers.getContractFactory("CROWDToken");
        ticketToken = await factory2.deploy("CROWD.com", "TICKET", 10000000);;
        let factory3 = await ethers.getContractFactory("IDOWallet");
        idoWallet = await factory3.deploy();

        console.log('crowd : ' + crowdToken.address);
        console.log('ticket : ' + ticketToken.address);
        console.log('wallet : ' + idoWallet.address);

        await idoWallet.setValidator(crowdToken.address, signer.address);
        await idoWallet.setValidator(ticketToken.address, signer.address);
        await idoWallet.setReciever(accounts[3].address);
    });

    it('wallet invest test', async () => {

        var failed = false;
        var deposit_amount = decimal;
        //fail test : ERC20: transfer amount exceeds balance
        try{
            await idoWallet.connect(tester).deposit(crowdToken.address, deposit_amount.toString());
        }catch(err){
            console.log(err);
            failed = true;
        }finally{
            assert.equal(failed, true);
        }

        await crowdToken.transfer(tester.address, deposit_amount);

        let allowance = await crowdToken.allowance(tester.address, idoWallet.address);
        if(allowance.valueOf() == 0){
            console.log('approve unlimited');
            await crowdToken.connect(tester).approve(idoWallet.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
        }
        await idoWallet.connect(tester).deposit(crowdToken.address, deposit_amount.toString());

        
        //verify("claimIDO", id, msg.sender, amount, contract_address, expired_at, _validator, signature);
        var id = 1;
        var amount = decimal;
        var expired_at = 0;

        var encoded_packed = ethers.utils.solidityPack(['string', 'uint256', 'address', 'uint256', 'address', 'uint256']
        , ["withdraw", id, tester.address, amount, crowdToken.address, expired_at]);
        var msg_hashed = ethers.utils.keccak256(encoded_packed);
        var msgBytes = ethers.utils.arrayify(msg_hashed);
        var sig = await signer.signMessage(msgBytes);

        var recover_signer = ethers.utils.recoverAddress(hashMessage(msgBytes), sig);
        assert.equal(recover_signer, signer.address);


        let r_allowance = await crowdToken.allowance(receiver.address, idoWallet.address);
        if(r_allowance.valueOf() == 0){
            console.log('approve unlimited');
            await crowdToken.connect(receiver).approve(idoWallet.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935');
        }

        //claimIDO(address contract_address, uint256 amount, uint256 id, uint256 expired_at, bytes memory signature) public
        await idoWallet.connect(tester).withdraw(crowdToken.address, amount, id, expired_at, sig);

        var balance = await crowdToken.balanceOf(tester.address);

        assert.equal(balance, amount);
    });

    it('wallet ticket test', async () => {
        //function withdrawTicket(uint256 amount, uint256 id, uint256 expired_at, bytes memory signature) public
        //verify("withdrawTicket", id, msg.sender, amount, address(this), expired_at, getValidator(address(this)), signature);
    });
});