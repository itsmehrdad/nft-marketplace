require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks:{
    hardhat:{
      chainId:1337
    },
    mumbai: {
      url:"https://rpc-mumbai.maticvigil.com",
      accounts:["09f8dc63f8746de5ca6ebc25be6463e94f6d79fca8ce76fb7f939c6a2026004c"]
    }
  }
};
