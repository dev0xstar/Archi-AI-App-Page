import { SectionTitle } from 'src/components/UI/SectionTitle';
import { BOTS } from 'src/constants/bots';
import { BotCard } from 'src/pages/pricing/components/BotCard';

export const Pricing = () => {
  return (
    <>
      <SectionTitle>Welcome to our bots</SectionTitle>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {BOTS.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>
    </>
  );
};
