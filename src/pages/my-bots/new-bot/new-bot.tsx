import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { SectionTitle } from 'src/components/UI/SectionTitle';
import { UIButton } from 'src/components/UI/UIButton';
import { INIT_BOT_SETTINGS, ITEMS_INTEGRATIONS } from 'src/constants/bots';
import { BotIntegrations } from 'src/pages/my-bots/components/BotIntegrations';
import { BotKnowledgeBase } from 'src/pages/my-bots/components/BotKnowledgeBase';
import { BotSettings } from 'src/pages/my-bots/components/BotSettings';
import { NewBotSteps } from 'src/pages/my-bots/new-bot/components/NewBotSteps';
import { KnowledgeBaseItem } from 'src/types/bots';

export const NewBot = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(INIT_BOT_SETTINGS);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[] | null>(null);

  const [URLSearchParams] = useSearchParams();
  const currentStep = URLSearchParams.get('step') || '1';

  return (
    <>
      <SectionTitle>New Bot</SectionTitle>
      <NewBotSteps currentTab={currentStep} />
      <OpacityBox>
        {currentStep === '1' && (
          <>
            <BotSettings {...{ settings, setSettings }} />
            <div className="mt-6 text-right">
              <UIButton color="gray" className="mr-4 w-32" onClick={() => navigate('/my-bots')}>
                Cancel
              </UIButton>
              <UIButton className="w-32" onClick={() => navigate('#step=2')}>
                Next
              </UIButton>
            </div>
          </>
        )}
        {currentStep === '2' && (
          <>
            <BotKnowledgeBase knowledgeBase={knowledgeBase} setKnowledgeBase={setKnowledgeBase} />
            <div className="mt-6 text-right">
              <UIButton color="gray" className="mr-4 w-32" onClick={() => navigate('#step=1')}>
                Cancel
              </UIButton>
              <UIButton className="w-32" onClick={() => navigate('#step=3')}>
                Next
              </UIButton>
            </div>
          </>
        )}
        {currentStep === '3' && (
          <>
            <BotIntegrations items={ITEMS_INTEGRATIONS} />
            <div className="mt-6 text-right">
              <UIButton color="gray" className="mr-4 w-32" onClick={() => navigate('#step=2')}>
                Cancel
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
