import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LoadingStub } from 'src/components/UI/LoadingStub';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { SectionTitle } from 'src/components/UI/SectionTitle';
import { UIButton } from 'src/components/UI/UIButton';
import { UISwitch } from 'src/components/UI/UISwitch';
import { UITooltip } from 'src/components/UI/UITooltip';
import { ITEMS_INTEGRATIONS } from 'src/constants/bots';
import { useBotsApi } from 'src/hooks/useBotsApi';
import { BotIntegrations } from 'src/pages/my-bots/components/BotIntegrations';
import { BotKnowledgeBase } from 'src/pages/my-bots/components/BotKnowledgeBase';
import { BotSettings } from 'src/pages/my-bots/components/BotSettings';
import { NewBotSteps } from 'src/pages/my-bots/new-bot/components/NewBotSteps';
import { useBots } from 'src/providers/BotsProvider';
import { BotSettingsType, KnowledgeBaseItem } from 'src/types/bots';

const DEMO_VALUES = [
  {
    name: 'Generate images',
    value: true,
    info: "Leverage AI bot's image generation capabilities to create visually captivating artwork and visuals.",
  },
  {
    name: 'Smart contracts analysis',
    value: true,
    info: "Utilize bot's capacity for in-depth smart analysis of smart contracts.",
  },
  {
    name: 'Realtime token data',
    value: true,
    info: 'Stay updated with the latest token information, including live prices and market trends.',
  },
  {
    name: 'News summary',
    value: true,
    info: 'Concise summaries of project posts and articles, making it easy to stay informed about the latest updates and developments.',
  },
  {
    name: 'Chat summary',
    value: true,
    info: 'Receive concise and informative summaries of the chat conversations, facilitating efficient review of essential discussions.',
  },
  {
    name: 'Jokes',
    value: true,
    info: "Enjoy a dose of humor with our bot's collection of jokes and witty remarks.",
  },
  {
    name: 'Compliment',
    value: true,
    info: 'Brighten your day with kind words and compliments from the friendly bot.',
  },
];

export const BotId = () => {
  const { address } = useWeb3ModalAccount();
  const { botId } = useParams() as { botId: string };
  const { fetchBotInfo, currentBot, fetchingCurrentBot } = useBots();
  const navigate = useNavigate();
  const [URLSearchParams, setURLSearchParams] = useSearchParams();
  const { patchBot } = useBotsApi();

  const [settings, setSettings] = useState<BotSettingsType | null>(null);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[] | null>(null);
  const [shadowSettings, setShadowSettings] = useState<BotSettingsType | null>(null);
  const [saving, setSaving] = useState(false);

  const [demoValues, setDemoValues] = useState(DEMO_VALUES);

  const needToSave = JSON.stringify(settings) !== JSON.stringify(shadowSettings);
  const currentStep = URLSearchParams.get('step') || '1';

  useEffect(() => {
    if (!address) return;
    fetchBotInfo();
  }, [address]);

  useEffect(() => {
    setShadowSettings(currentBot?.settings || null);
    setSettings(currentBot?.settings || null);
    setKnowledgeBase(currentBot?.knowledgeBase || null);
  }, [currentBot]);

  const handleSave = async () => {
    if (!shadowSettings) return;
    if (!settings) return;

    setSaving(true);

    const itemsForSave: Record<string, any> = {};

    Object.entries(shadowSettings).forEach(([key, value]) => {
      if (settings[key as keyof BotSettingsType] !== value) {
        itemsForSave[key] = value;
      }
    });

    await patchBot(botId, itemsForSave, () => toast.error('Saving Failed'));

    setSaving(false);
  };

  const changeTabHandler = (value: '1' | '2' | '3') => {
    URLSearchParams.set('step', value);
    setURLSearchParams(URLSearchParams);
  };

  if (fetchingCurrentBot) return <LoadingStub label="Loading bot settings..." />;

  if (!currentBot) {
    return <LoadingStub label="Bot not found..." />;
  }

  return (
    <>
      <SectionTitle>Edit Bot</SectionTitle>
      <NewBotSteps currentTab={currentStep} />
      <OpacityBox className="mb-24">
        {currentStep === '1' && shadowSettings && (
          <>
            <h3 className="text-2xl mb-6">Common info</h3>
            <BotSettings settings={shadowSettings} setSettings={setShadowSettings} />
            <h3 className="text-2xl mt-6 mb-6">Features</h3>
            <div className="grid grid-cols-4 gap-4">
              {demoValues.map((el, index) => (
                <UISwitch
                  size="lg"
                  label={
                    <div className="flex items-center space-x-4">
                      <div>{el.name}</div>
                      <UITooltip message={el.info} />
                    </div>
                  }
                  value={el.value}
                  onChange={(value) =>
                    setDemoValues(
                      demoValues.map((innerItem, innerIndex) =>
                        innerIndex === index ? { ...innerItem, value } : innerItem,
                      ),
                    )
                  }
                />
              ))}
            </div>
            <div className="mt-10 text-right">
              <UIButton color="gray" className="mr-4 w-32" onClick={() => navigate('/my-bots')}>
                Cancel
              </UIButton>
              {needToSave ? (
                <UIButton processing={saving} className="w-32" onClick={handleSave}>
                  Save
                </UIButton>
              ) : (
                <UIButton className="w-32" onClick={() => changeTabHandler('2')}>
                  Next
                </UIButton>
              )}
            </div>
          </>
        )}
        {currentStep === '2' && (
          <>
            <BotKnowledgeBase knowledgeBase={knowledgeBase} setKnowledgeBase={setKnowledgeBase} />
            <div className="mt-10 text-right">
              <UIButton color="gray" className="mr-4 w-32" onClick={() => changeTabHandler('1')}>
                Back
              </UIButton>
              <UIButton className="w-32" onClick={() => changeTabHandler('3')}>
                Next
              </UIButton>
            </div>
          </>
        )}
        {currentStep === '3' && (
          <>
            <BotIntegrations items={ITEMS_INTEGRATIONS} />
            <div className="mt-10 text-right">
              <UIButton color="gray" className="mr-4 w-32" onClick={() => changeTabHandler('2')}>
                Back
              </UIButton>
              <UIButton className="w-32" onClick={() => null}>
                Submit
              </UIButton>
            </div>
          </>
        )}
      </OpacityBox>
    </>
  );
};
