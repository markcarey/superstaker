/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-waffle");
const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ] 
},
   defaultNetwork: "hardhat",
   networks: {
    hardhat: {
      chainId: 1337,
      accounts: [{ privateKey: `0x${PRIVATE_KEY}`, balance: "10000000000000000000000"}],
      forking: {
        url: API_URL,
        blockNumber: 14813353  // assumes ETH mainnet fork
      },
      loggingEnabled: true,
      gasMultiplier: 7,
      gasPrice: 1000000000 * 5,
      blockGasLimit: 0x1fffffffffffff
    },
    ethereum: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    }
   },
   etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
}

// 
// npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/y2J0jJRJ0W0l7e7J1CVv4zRj-GgBjNHP --fork-block-number 14813353