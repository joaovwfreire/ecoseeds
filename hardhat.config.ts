import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-truffle5";
import '@openzeppelin/hardhat-upgrades';
import "hardhat-deploy";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
      chainId: 44787
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
      chainId: 42220
    }
  },
  solidity: {
    compilers: [
        {
            version: "0.8.19",
            settings: {
              viaIR: true,
              metadata: {
                appendCBOR: false,
                bytecodeHash: "none"
              },
              optimizer: {
                enabled: true,
                runs: 1,
              }
            }
          }
    ]
  }

};

export default config;