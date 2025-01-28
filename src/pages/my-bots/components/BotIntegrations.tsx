import { FC } from 'react';
import { ITEMS_INTEGRATIONS } from 'src/constants/bots';
import { BotIntegrationsItem } from 'src/pages/my-bots/components/BotIntegrationsItem';

type Props = {
  items: typeof ITEMS_INTEGRATIONS;
};

export const BotIntegrations: FC<Props> = ({ items }) => {
  return (
    <div className="mt-16">
      <span className="text-lg">Integrations</span>
      <div className="flex space-x-4 mt-6">
        {items.map((item) => (
          <BotIntegrationsItem item={item} />
        ))}
      </div>
    </div>
  );
};
