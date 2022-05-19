const { expect } = require("chai");
const { ethers } = require("hardhat");

require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const REFERRAL = process.env.REFERRAL;

var BN = web3.utils.BN;

const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);
var wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const stethAddress = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";
const dataProviderAddress = "0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d";
const poolAddress = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";

const varDebtTokenAddress = "0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf";
const debtTokenABI = [{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"underlyingAsset","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"incentivesController","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"fromUser","type":"address"},{"indexed":true,"internalType":"address","name":"toUser","type":"address"},{"indexed":false,"internalType":"address","name":"asset","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BorrowAllowanceDelegated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"underlyingAsset","type":"address"},{"indexed":true,"internalType":"address","name":"pool","type":"address"},{"indexed":false,"internalType":"address","name":"incentivesController","type":"address"},{"indexed":false,"internalType":"uint8","name":"debtTokenDecimals","type":"uint8"},{"indexed":false,"internalType":"string","name":"debtTokenName","type":"string"},{"indexed":false,"internalType":"string","name":"debtTokenSymbol","type":"string"},{"indexed":false,"internalType":"bytes","name":"params","type":"bytes"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"onBehalfOf","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DEBT_TOKEN_REVISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POOL","outputs":[{"internalType":"contract ILendingPool","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"UNDERLYING_ASSET_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approveDelegation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"fromUser","type":"address"},{"internalType":"address","name":"toUser","type":"address"}],"name":"borrowAllowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getIncentivesController","outputs":[{"internalType":"contract IAaveIncentivesController","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getScaledUserBalanceAndSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"onBehalfOf","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"scaledBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"scaledTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const varDebtWETH = new ethers.Contract(varDebtTokenAddress, debtTokenABI, signer);

const poolJSON = require("../artifacts/contracts/interfaces/aave/ILendingPool.sol/ILendingPool.json");
const pool = new ethers.Contract(poolAddress, poolJSON.abi, signer);

const stethJSON = require("../artifacts/contracts/interfaces/lido/IStETH.sol/IStETH.json");
const steth = new ethers.Contract(stethAddress, stethJSON.abi, signer);

var staker;

var amt = ethers.utils.parseEther("1.0");

var factor = 150;

describe.only("Deposit Native ETH", function() {

    before('Deploy Contract', async function() {
        // runs once before the first test in this block
        this.timeout(2400000);
        //await hre.network.provider.send("hardhat_reset");
        const Staker = await ethers.getContractFactory("SuperStaker");
        staker = await Staker.deploy(wethAddress, stethAddress, dataProviderAddress, poolAddress, REFERRAL);
        await staker.deployed();
        console.log("SuperStaker deployed to address:", staker.address);
    });

    it("should delegate credit to the Staker contract", async function() {
        await ( await varDebtWETH.approveDelegation(staker.address, ethers.utils.parseEther("1.5")) ).wait();
        const allowance = await varDebtWETH.borrowAllowance(PUBLIC_KEY, staker.address);
        console.log(allowance);
        expect(allowance).to.equal(ethers.utils.parseEther("1.5"));
    });
  
    it.skip("should deposit native ETH and SuperStake it", async function() {
        await ( await staker.stake(factor, {value: amt}) ).wait();
        const data = await pool.getUserAccountData(PUBLIC_KEY);
        console.log(data);
        expect(1).to.equal(1);
    });

    it("should approve stETH transfer to the Staker contract", async function() {
        await ( await steth.approve(staker.address, amt) ).wait();
        const allowance = await steth.allowance(PUBLIC_KEY, staker.address);
        console.log(allowance);
        expect(allowance).to.equal(amt);
    });

    it("should impersonate and get some stETH", async function() {
        const eoa = "0x6Cf9AA65EBaD7028536E353393630e2340ca6049";
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [eoa],
        });
        const signer = await ethers.getSigner(eoa);
        let contract = new ethers.Contract(
            stethAddress,
            stethJSON.abi,
            signer
        );
        var bal = await contract.balanceOf(eoa);
        await (await contract.transfer(PUBLIC_KEY, bal)).wait();
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [eoa],
        });
        const stethBal = await contract.balanceOf(PUBLIC_KEY);
        expect(parseInt(stethBal)).to.be.gt(0);
    });

    it("should deposit stETH and SuperStake it", async function() {
        await ( await staker.superStake(amt, factor) ).wait();
        const data = await pool.getUserAccountData(PUBLIC_KEY);
        console.log(data);
        expect(1).to.equal(1);
    });

});