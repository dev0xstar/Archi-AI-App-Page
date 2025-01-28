import { FC } from 'react';
import { ExecuteButton } from 'src/components/ExecuteButton';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { Stake, WalletStake } from 'src/types/stakes';
import { getDisplayAmount, shortenNumber } from 'src/utils/bigNumber';

const BG_CLASSES = ['bg-stake-14', 'bg-stake-24', 'bg-stake-56'];

const BUTTON_COLORS = ['default', 'orange', 'blue'] as const;

type StakeCardProps = {
  stake: Stake;
  i: number;
  walletStake: WalletStake | undefined;
  walletStakeSum: string;
  onStake: () => void;
};

export const StakeCard: FC<StakeCardProps> = ({
  stake,
  walletStake,
  walletStakeSum,
  i,
  onStake,
}) => {
  const bgUrl = BG_CLASSES[i];
  const buttonColor = BUTTON_COLORS[i] || 'default';

  return (
    <OpacityBox className={`flex flex-col bg-cover bg-no-repeat ${bgUrl}`}>
      <h4 className="text-4xl mb-4">{stake.days.toString()} days</h4>
      <p className="text-xl opacity-40 mb-8">ETH Sharing</p>
      <div className="flex flex-col self-start text-center mb-20 space-y-1">
        <span className="px-10 py-2 bg-white bg-opacity-10 rounded-xl">{stake.apy}% APY</span>
        <span className="px-10 py-2 bg-white bg-opacity-10 rounded-xl">{stake.apr}% APR</span>
        <span className="px-10 py-2 bg-white bg-opacity-10 rounded-xl">
          {shortenNumber(getDisplayAmount(walletStakeSum || '0', { decimals: 18 }))} ARCHI/
          {walletStake?.poolShare
            ? getDisplayAmount(walletStake.poolShare, { decimals: 16, round: 2 })
            : 0}
          %
        </span>
      </div>
      <ExecuteButton
        label="Stake now"
        onClick={onStake}
        color={buttonColor}
        className={'w-full text-center'}
      />
    </OpacityBox>
  );
};
