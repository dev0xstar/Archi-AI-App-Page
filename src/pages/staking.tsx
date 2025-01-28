import { StakeCard } from 'src/components/StakeCard';
import { LoadingStub } from 'src/components/UI/LoadingStub';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { SectionTitle } from 'src/components/UI/SectionTitle';
import { UIButton } from 'src/components/UI/UIButton';
import { WalletStakeCard } from 'src/components/WalletStakeCard';
import { useSetModal } from 'src/providers/ModalsProvider';
import { useStakes } from 'src/providers/StakesProvider';

export const Staking = () => {
  const { fetchWalletStakes, fetchStakes } = useStakes();
  const setModal = useSetModal();

  const { stakes, fetching, walletStakes, walletStakesSum } = useStakes();

  if (fetching) return <LoadingStub label="Fetching data..." containerSize="full" />;

  return (
    <>
      <SectionTitle>Staking</SectionTitle>
      <OpacityBox className="mb-6">
        <h4 className="text-2xl mb-1">Pool Size</h4>
        <p className="opacity-40">
          Leverage the power of compounding by staking your $ARCHI tokens and compounding rewards as
          they accrue
        </p>
      </OpacityBox>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stakes.map((stake, i) => (
          <StakeCard
            key={stake.sec}
            i={i}
            stake={stake}
            walletStake={walletStakes.find((el) => el.period === stake.sec.toString())}
            walletStakeSum={walletStakesSum[stake.sec.toString()]}
            onStake={() =>
              setModal({
                key: 'stakes',
                stakes,
                walletStakesSum,
                selectedIndex: i,
                fetchWalletStakes,
                fetchStakes,
              })
            }
          />
        ))}
      </div>
      <OpacityBox className="flex flex-col">
        <div className="flex items-center">
          <div className="mr-auto">
            <h4 className="text-2xl mb-6">My Stakes & Rewards</h4>
            {walletStakes.length === 0 && <p className="opacity-40">You have no staked ARCHI</p>}
          </div>
          {walletStakes.length === 0 && (
            <UIButton
              onClick={() =>
                setModal({
                  key: 'stakes',
                  stakes,
                  walletStakesSum,
                  selectedIndex: 0,
                  fetchWalletStakes,
                  fetchStakes,
                })
              }
              buttonType="stroke"
            >
              Stake now
            </UIButton>
          )}
        </div>

        {walletStakes.map((stake) => (
          <WalletStakeCard key={stake.stakeId} stake={stake} />
        ))}
      </OpacityBox>
    </>
  );
};
