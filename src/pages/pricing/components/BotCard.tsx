import { FC } from 'react';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { UIButton } from 'src/components/UI/UIButton';
import { useSetModal } from 'src/providers/ModalsProvider';
import { StaticBot } from 'src/types/bots';

type Props = { bot: StaticBot };

export const BotCard: FC<Props> = ({ bot }) => {
  const setModal = useSetModal();

  const getButtonColor = (id: StaticBot['id']) => {
    const colorMap = { xc: 'default', xt: 'orange', xo: 'blue' } as const;
    return colorMap[id];
  };

  return (
    <div className="pt-[150%] relative">
      <OpacityBox
        className={
          'flex flex-col absolute left-0 top-0 w-full h-full bg-right-bottom bg-no-repeat bg-[length:auto_100%]'
        }
        style={{ backgroundImage: `url('${bot.imageUrl}')` }}
      >
        <h3 className="mb-5 text-3xl">{bot.name}</h3>
        <p className="opacity-50">{bot.description}</p>
        {bot.label && (
          <span className="bg-white bg-opacity-40 px-3 pt-1.5 pb-1 rounded-xl self-start mt-4">
            {bot.label}
          </span>
        )}
        <UIButton
          color={getButtonColor(bot.id)}
          className="w-full mb-4 mt-auto"
          onClick={() =>
            bot.disabled
              ? null
              : bot.id === 'xt'
                ? window.open('https://t.me/AIgentXTBot', '_blank', 'noopener,noreferrer')
                : setModal({ key: bot.modalKey })
          }
        >
          {bot.disabled ? 'Coming soon' : bot.buttonLabel}
        </UIButton>
      </OpacityBox>
    </div>
  );
};
