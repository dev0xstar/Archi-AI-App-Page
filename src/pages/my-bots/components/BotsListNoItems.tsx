import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { UIButton } from 'src/components/UI/UIButton';

export const BotsListNoItems = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-lg text-center my-5">You didn't create any bots yet</p>
      <UIButton
        className="w-48"
        startIcon={<Icon icon="fa6-solid:plus" />}
        onClick={() => navigate('new-bot')}
        disabled
      >
        Create bot
      </UIButton>
    </div>
  );
};
