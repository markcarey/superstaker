const { ethers } = require("hardhat");

require('dotenv').config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const REFERRAL = process.env.REFERRAL;

var BN = web3.utils.BN;

const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const stethAddress = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";
const poolAddress = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
var staker;

const gasOptions = {"nonce": 0, "maxPriorityFeePerGas": "21000000000", "maxFeePerGas": "21000000020" };

async function main() {
    const Staker = await ethers.getContractFactory("SuperStaker");
    staker = await Staker.deploy(wethAddress, stethAddress, poolAddress, REFERRAL, gasOptions);
    console.log(staker);
    await staker.deployed();
    console.log("SuperStaker deployed to address:", staker.address);
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});

// npx hardhat run scripts/deploy.js --network localhost