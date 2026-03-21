import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const { LISK_SEPOLIA_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.30",
  networks: {
    liskSepolia: {
      url: `${LISK_SEPOLIA_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 4202,
    },
  },
 etherscan: {
    apiKey: {
      liskSepolia: "empty"
    },
    customChains: [
      {
        network: "liskSepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com"
        }
      }
    ]
  },

  sourcify: {
    enabled: false
  }
};

export default config;