import { LoadingStub } from 'src/components/UI/LoadingStub';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { BotsListItem } from 'src/pages/my-bots/components/BotsListItem';
import { BotsListNoItems } from 'src/pages/my-bots/components/BotsListNoItems';
import { useBots } from 'src/providers/BotsProvider';

export const BotsList = () => {
  const { bots, fetchingBots } = useBots();

  if (fetchingBots) return <LoadingStub label="Loading bots..." />;

  return (
    <OpacityBox>
      <span className="text-lg">All bots</span>

      {bots?.length === 0 || !bots ? (
        <BotsListNoItems />
      ) : (
        <div className="mt-6">
          <div className="flex mb-4 px-4">
            <div className="w-4/12">Bot name</div>
            <div className="w-2/12">Type</div>
            <div className="w-2/12">Status</div>
            <div className="w-2/12">Size</div>
            <div className="w-2/12 text-right"></div>
          </div>
          <div className="flex flex-col">{bots?.map((bot) => <BotsListItem bot={bot} />)}</div>
        </div>
      )}
    </OpacityBox>
  );
};
