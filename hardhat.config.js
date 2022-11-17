require("@nomicfoundation/hardhat-toolbox");
const { ALCHEMY_API_KEY, POLYGON_PRIVATE_KEY, POLYGON_SCAN_API } = require('./env')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${POLYGON_PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: POLYGON_SCAN_API
  }
};
