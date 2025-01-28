import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { UIButton } from 'src/components/UI/UIButton';
import { ITEMS_INTEGRATIONS } from 'src/constants/bots';
import { useBotsApi } from 'src/hooks/useBotsApi';
import { useSetModal } from 'src/providers/ModalsProvider';

export const BotIntegrationsItem: FC<{ item: (typeof ITEMS_INTEGRATIONS)[number] }> = ({
  item,
}) => {
  const { botId } = useParams();
  const setModal = useSetModal();
  const { fetchTelegramUser } = useBotsApi();

  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItemStatus();
  }, []);

  const getItemStatus = async () => {
    setLoading(true);
    switch (item.id) {
      case 'telegram': {
        const user = await fetchTelegramUser();
        if (user?.user_id) {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }

        break;
      }

      default:
        break;
    }

    setLoading(false);
  };

  const getButtonLabel = () => {
    if (item.disabled) return 'Coming soon';
    if (loading) return 'Loading...';
    return status === 'connected' ? 'Connected' : 'Connect';
  };

  const connectHandler = () => {
    if (status === 'connected') return;

    if (item.id === 'webchat') setModal({ key: 'web-integration', botId });
    if (item.id === 'telegram') setModal({ key: 'telegram-integration' });
  };

  return (
    <OpacityBox key={item.id} className="flex-1 p-4">
      <img className="w-12" src={item.icon} alt={item.name} />
      <span className="block mt-4">{item.name}</span>
      <UIButton
        className="bg-white bg-opacity-10 mt-4 w-full px-2"
        color="gray"
        onClick={connectHandler}
        disabled={status === 'connected' || item.disabled}
      >
        {getButtonLabel()}
      </UIButton>
    </OpacityBox>
  );
};
