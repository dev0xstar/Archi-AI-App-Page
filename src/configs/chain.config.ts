import { ethers } from 'ethers';

export type ChainConfig = typeof CHAIN;

export const CHAIN =
  import.meta.env.VITE_USE_TEST_NET === 'true'
    ? {
        id: 5,
        name: 'Goerli test network',
        explorer: 'https://goerli.etherscan.io/',
        rpcProviderUrl: 'https://rpc.ankr.com/eth_goerli',
        wsProviderUrl: 'wss://goerli.infura.io/ws/v3/db72eb2275564c62bfa71896870d8975',
        contracts: {
          AIXRevenueSharing: '0x54B8602f5d4e8689cF77f67cEd309162D6Cf69E8',
          ARCHI: '0x58D1C150E88898934C5D347e97744a47B5A67013',
          payments: '0x21071e52Cd21F1411eC1E5a372239aCECa76891F',
        },
        paramsForAdding: {
          rpcProvider: 'https://goerli.infura.io/v3/',
          nativeCurrency: {
            name: 'GoerliETH',
            symbol: 'GoerliETH',
            decimals: 18,
          },
          hexId: ethers.toQuantity(5),
        },
      }
    : {
        id: 1,
        name: 'Mainnet network',
        explorer: 'https://etherscan.io/',
        rpcProviderUrl: 'https://mainnet.infura.io/v3/92eb829b550743f2a839c803401503fc',
        wsProviderUrl: 'wss://mainnet.infura.io/ws/v3/92eb829b550743f2a839c803401503fc',
        contracts: {
          AIXRevenueSharing: '0xd051eF3DBBEA636Fa009A0318ac51e9eE2CBc3bD',
          ARCHI: '0xa6D71ec4dEccF29F53600D55fb9f33c525632C10',
          payments: '0xC889891630598a90D2A2360f891f492CAd5aA887',
        },
        paramsForAdding: {
          rpcProvider: 'https://mainnet.infura.io/v3/',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          hexId: ethers.toQuantity(1),
        },
      };
