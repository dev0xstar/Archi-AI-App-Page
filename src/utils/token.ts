import { Call, Contract, Provider } from 'ethcall';
import { ethers } from 'ethers';
import { erc20Abi } from 'src/abi';
import { ChainConfig } from 'src/configs/chain.config';
import { ZERO_ADDRESS } from 'src/constants/eth';
import { Token, TokenInfoCallsRes } from 'src/types/tokens';
import { createMatrix } from 'src/utils/array';
import { isZeroAddress } from 'src/utils/compareAddresses';

/**
 * Fetches information about tokens on a blockchain.
 * @param {ChainConfig} chainConfig - Configuration for the blockchain chain.
 * @param {ethers.JsonRpcProvider} appRpcProvider - The JSON RPC provider for blockchain queries.
 * @param {string[]} addresses - An array of token contract addresses.
 * @returns {Promise<Token[]>} An array of tokens with their details.
 */
export async function fetchTokensInfo(
  chainConfig: ChainConfig,
  appRpcProvider: ethers.JsonRpcProvider,
  addresses: string[],
): Promise<Token[]> {
  const ethcallProvider = new Provider(chainConfig.id, appRpcProvider);
  const calls: Call[] = [];
  const ethIndexes: number[] = [];

  const addressesWithoutEth = addresses.filter((el, index) => {
    if (isZeroAddress(el)) {
      ethIndexes.push(index);
      return false;
    }
    return true;
  });

  addressesWithoutEth.forEach((address) => {
    const contract = new Contract(address, erc20Abi);
    calls.push(contract.name(), contract.symbol(), contract.decimals());
  });

  try {
    const tokensInfoRaw = await ethcallProvider.all(calls);
    const tokensInfoSplitted = createMatrix(tokensInfoRaw, 3) as TokenInfoCallsRes[];
    const tokensInfo: Token[] = tokensInfoSplitted.map((token, i) => ({
      name: token[0],
      symbol: token[1],
      decimals: Number(token[2]),
      address: addressesWithoutEth[i].toLowerCase(),
    }));

    ethIndexes.forEach((i) => {
      tokensInfo.splice(i, 0, {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        address: ZERO_ADDRESS,
        isEth: true,
      });
    });

    return tokensInfo;
  } catch (e) {
    console.error(e);
    return [];
  }
}
