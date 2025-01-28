import { Icon } from '@iconify/react';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, ethers } from 'ethers';
import { FC, useEffect, useState } from 'react';
import { AIXRevenueSharingAbi } from 'src/abi';
import AIXTiker from 'src/assets/images/IGD-black-white.svg?react';
import { CircleWithIcon } from 'src/components/UI/CircleWithIcon';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { useImmutableCallback } from 'src/hooks/useActualRef';
import { useTimeUntil } from 'src/hooks/useTimeUntil';
import { useAppChain } from 'src/providers/AppChainProvider';
import { useSetModal } from 'src/providers/ModalsProvider';
import { useStakes } from 'src/providers/StakesProvider';
import { useTransactions } from 'src/providers/TransactionsProvider';
import { WalletStake } from 'src/types/stakes';
import { BN, getDisplayAmount, shortenNumber } from 'src/utils/bigNumber';
import { secToDays } from 'src/utils/dates';

export const WalletStakeCard: FC<{ stake: WalletStake }> = ({ stake }) => {
  const { fetchWalletStakes, fetchStakes, stakes } = useStakes();
  const timeUntil = useTimeUntil(stake.unstakeTimestamp);
  const setModal = useSetModal();
  const { walletProvider } = useWeb3ModalProvider();
  const { chainId, isConnected } = useWeb3ModalAccount();
  const [{ chainConfig }] = useAppChain();
  const { trackTx, trackError } = useTransactions();

  const [isOpen, setIsOpen] = useState(false);

  const wrongNetwork = isConnected && chainId !== chainConfig.id;
  const selectedStake = stakes.find((el) => el.sec.toString() === stake.period);

  const clickHandler = useImmutableCallback(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    window.document.addEventListener('click', clickHandler);

    return () => window.document.removeEventListener('click', clickHandler);
  }, []);

  async function claim() {
    if (timeUntil !== '0') return;
    if (wrongNetwork) {
      return;
    }

    if (!walletProvider) return;

    setIsOpen(false);

    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      chainConfig.contracts.AIXRevenueSharing,
      AIXRevenueSharingAbi,
      signer,
    );

    let tx;

    try {
      setModal({ key: 'loader', title: 'Confirm your transaction in the wallet' });
      const gasLimit = await contract.claimRewards.estimateGas(stake.stakeId);

      tx = await contract.claimRewards(stake.stakeId, {
        gasLimit: BN(gasLimit.toString()).times(1.2).toFixed(0),
      });

      setModal({
        key: 'loader',
        title: 'Claiming rewards',
        txHash: tx.hash,
      });

      trackTx(tx);

      await tx.wait();

      setModal(null);
      fetchStakes();
      fetchWalletStakes();
    } catch (err: any) {
      trackError(err, tx);
      setModal(null);
      console.error('claim failed', err);
      throw err;
    }
  }

  async function restake() {
    if (wrongNetwork) {
      return;
    }

    if (!walletProvider) return;

    setIsOpen(false);

    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      chainConfig.contracts.AIXRevenueSharing,
      AIXRevenueSharingAbi,
      signer,
    );

    let tx;

    try {
      setModal({ key: 'loader', title: 'Confirm your transaction in the wallet' });
      const gasLimit = await contract.restakeRewards.estimateGas(stake.stakeId, 0);

      tx = await contract.restakeRewards(stake.stakeId, 0, {
        gasLimit: BN(gasLimit.toString()).times(1.2).toFixed(0),
      });

      setModal({
        key: 'loader',
        title: 'Compounding ETH & Relocking',
        txHash: tx.hash,
      });

      trackTx(tx);

      await tx.wait();

      setModal(null);
      fetchStakes();
      fetchWalletStakes();
    } catch (err: any) {
      trackError(err, tx);
      setModal(null);
      console.error('restake failed', err);
      throw err;
    }
  }

  async function unstake() {
    if (wrongNetwork) {
      return;
    }

    if (!walletProvider) return;

    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      chainConfig.contracts.AIXRevenueSharing,
      AIXRevenueSharingAbi,
      signer,
    );

    let tx;

    try {
      setModal({ key: 'loader', title: 'Confirm your transaction in the wallet' });
      const gasLimit = await contract.unstake.estimateGas(stake.stakeId, stake.stakedAmount);

      tx = await contract.unstake(stake.stakeId, stake.stakedAmount, {
        gasLimit: BN(gasLimit.toString()).times(1.2).toFixed(0),
      });

      setModal({
        key: 'loader',
        title: 'Unstaking',
        txHash: tx.hash,
      });

      trackTx(tx);

      await tx.wait();

      setModal(null);
      fetchStakes();
      fetchWalletStakes();
    } catch (err: any) {
      trackError(err, tx);
      setModal(null);
      console.error('unstake failed', err);
      throw err;
    }
  }

  function unstakeHandler() {
    setIsOpen(false);

    if (timeUntil !== '0') {
      setModal({
        key: 'confirm',
        title: 'Confirm Action',
        confirmText: 'Yeah Unstake',
        cancelText: 'Cancel',
        body: (
          <div className="flex flex-col items-center text-center">
            <Icon className="text-red-600 text-4xl mb-4" icon="fa6-solid:triangle-exclamation" />
            <p className="text-xl text-red-600 mb-6">
              You unstake too early. Proceeding will forfeit your rewards and return only staked
              ARCHI.
            </p>
          </div>
        ),
        onConfirm: unstake,
      });
      return;
    }

    unstake();
  }

  return (
    <div className="flex items-center my-5">
      <div className="flex flex-col">
        <span className="text-4xl mb-1">{selectedStake ? selectedStake.apy : stake.apy}% APY</span>
        <span className="text-2xl mb-3">
          {selectedStake ? selectedStake.apr : BN(stake.apr).div(100).toString()}% APR
        </span>
        <div className="flex items-center">
          <span>{secToDays(stake.period)} days Lockup</span>
          <span className="ml-4 px-1.5 py-1.5 pb-1 bg-gray-700 opacity-50 rounded-xl">
            {timeUntil === '0' ? 'Claim available' : timeUntil}
          </span>
        </div>
      </div>
      <div className="flex ml-auto">
        <OpacityBox className="flex items-center p-4 rounded-2xl">
          <CircleWithIcon icon={<AIXTiker />} />
          <div className="flex flex-col ml-4">
            <span className="text-xl">
              {shortenNumber(getDisplayAmount(stake.stakedAmount, { decimals: 18 }))} ARCHI
            </span>
            <span className="opacity-40">Staked</span>
          </div>
        </OpacityBox>
        <OpacityBox className="flex items-center p-4 ml-3 rounded-2xl">
          <CircleWithIcon icon={<Icon className="text-black text-2xl" icon="logos:ethereum" />} />
          <div className="flex flex-col ml-4">
            <span className="text-xl">
              {shortenNumber(getDisplayAmount(stake.availableReward, { decimals: 18 }), 4)} ETH
            </span>
            <span className="opacity-40">Unclaimed ETH</span>
          </div>
        </OpacityBox>
        <OpacityBox
          className="flex items-center p-4 ml-6 self-center cursor-pointer relative rounded-2xl"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <Icon className="text-white text-lg" icon="fa6-solid:ellipsis" />
          {isOpen && (
            <div
              className="origin-top-right absolute right-full bottom-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {wrongNetwork && (
                <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-white bg-opacity-40 backdrop-blur-sm text-gray-700 rounded-md">
                  Wrong network
                </div>
              )}
              <div className="py-1" role="none">
                <div
                  className="text-gray-700 block px-4 py-2 text-sm cursor-pointer whitespace-nowrap hover:bg-gray-200"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-0"
                  onClick={restake}
                >
                  Compound ETH & Relock
                </div>
                <div
                  className={`text-gray-700 block px-4 py-2 text-sm whitespace-nowrap hover:bg-gray-200 ${
                    timeUntil !== '0' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                  }`}
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-1"
                  onClick={claim}
                >
                  Claim ETH & Relock
                </div>
                <div
                  className="text-gray-700 block px-4 py-2 text-sm cursor-pointer whitespace-nowrap hover:bg-gray-200"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-3"
                  onClick={unstakeHandler}
                >
                  Unstake
                </div>
              </div>
            </div>
          )}
        </OpacityBox>
      </div>
    </div>
  );
};
