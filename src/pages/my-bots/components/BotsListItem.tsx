import { Icon } from '@iconify/react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetModal } from 'src/providers/ModalsProvider';
import { BotListItem } from 'src/types/bots';

export const BotsListItem: FC<{ bot: BotListItem }> = ({ bot }) => {
  const setModal = useSetModal();
  const navigate = useNavigate();

  const deleteItemHandler = () => {
    setModal({
      key: 'confirm',
      body: undefined,
      cancelText: undefined,
      confirmText: 'Delete',
      size: 'md',
      danger: true,
      onConfirm: () => {},
      title: 'You want to delete the bot?',
    });
  };

  return (
    <div
      className="flex items-center rounded-xl p-4 odd:bg-white odd:bg-opacity-5 cursor-pointer"
      onClick={() => navigate(bot.id)}
    >
      <div className="flex items-center space-x-3 w-8/12">
        <div className="text-white">{bot.name}</div>
      </div>
      <div className="w-2/12">{bot.status}</div>
      <div className="w-2/12 text-right flex items-center space-x-2 justify-end">
        <Icon className="cursor-pointer" icon="fa6-solid:pen" />
        <Icon
          className="cursor-pointer"
          icon="fa6-solid:trash-can"
          onClick={(e) => {
            e.stopPropagation();
            deleteItemHandler();
          }}
        />
      </div>
    </div>
  );
};
