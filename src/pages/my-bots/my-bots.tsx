import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from 'src/components/UI/SectionTitle';
import { UIButton } from 'src/components/UI/UIButton';
import { BotsList } from 'src/pages/my-bots/components/BotsList';

export const MyBots = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <SectionTitle>Archi AI Agent</SectionTitle>
        <UIButton
          disabled
          onClick={() => navigate('new-bot')}
          startIcon={<Icon icon="fa6-solid:plus" />}
        >
          New bot
        </UIButton>
      </div>
      <BotsList />
    </>
  );
};
