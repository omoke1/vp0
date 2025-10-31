require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const { SEPOLIA_RPC_URL, MAINNET_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    hardhat: {},
    localhost: { url: 'http://127.0.0.1:8545' },
    sepolia: PRIVATE_KEY && SEPOLIA_RPC_URL ? { url: SEPOLIA_RPC_URL, accounts: [PRIVATE_KEY] } : undefined,
    mainnet: PRIVATE_KEY && MAINNET_RPC_URL ? { url: MAINNET_RPC_URL, accounts: [PRIVATE_KEY] } : undefined,
  },
  etherscan: ETHERSCAN_API_KEY ? { apiKey: ETHERSCAN_API_KEY } : undefined,
};


