import { useEffect, useState } from 'react';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { IOption, UIDropdown } from 'src/components/UI/UIDropdown';
import { CONVERSATIONS_FILTERS } from 'src/constants/conversations';
import { INIT_SELECTOR_STATE } from 'src/constants/diff';
import { useCRMApi } from 'src/hooks/useCRMApi';
import { ConversationsChat } from 'src/pages/conversations/components/ConversationsChat';
import { ConversationsFilters } from 'src/pages/conversations/components/ConversationsFilters';
import { ConversationsList } from 'src/pages/conversations/components/ConversationsList';
import { ConversationsVisitor } from 'src/pages/conversations/components/ConversationsVisitor';
import { BotConversationsList, BotsListResp } from 'src/types/conversation';
import { Nullable } from 'src/types/objectHelpers';

export const Conversations = () => {
  const [conversationsFilter, setConversationsFilter] = useState(CONVERSATIONS_FILTERS[0].value);
  const [selectedConversation, setSelectedConversation] =
    useState<Nullable<BotConversationsList['last_messages'][number]>>(null);
  const [bots, setBots] = useState<BotsListResp['bots_list']>([]);
  const [selectedBot, setSelectedBot] = useState<IOption>(INIT_SELECTOR_STATE);
  const [selectedBotConversations, setSelectedBotConversations] =
    useState<Nullable<BotConversationsList['last_messages']>>(null);

  const { fetchBotsList, fetchBotConversations } = useCRMApi();

  useEffect(() => {
    getBotsList();
  }, []);

  useEffect(() => {
    if (bots.length === 0) {
      setSelectedBot(INIT_SELECTOR_STATE);
      return;
    }

    setSelectedBot((prevState) => {
      if (prevState.value === bots[0].bot_name) return prevState;

      return {
        value: bots[0].bot_name,
        name: bots[0].bot_name,
      };
    });
  }, [bots]);

  useEffect(() => {
    getBotConversations();
  }, [selectedBot]);

  async function getBotsList() {
    const resp = await fetchBotsList();

    if (!resp) {
      setBots([]);
      return;
    }

    setBots(resp.bots_list);
  }

  async function getBotConversations() {
    if (!selectedBot.value) return;

    const resp = await fetchBotConversations(selectedBot.value);

    if (!resp) setSelectedBotConversations([]);
    else setSelectedBotConversations(resp.last_messages);
  }

  return (
    <div className="grid grid-cols-8 gap-4 flex-1 overflow-hidden">
      <OpacityBox className="p-0 overflow-hidden col-span-2">
        {bots.length > 1 && (
          <div className="px-2 mt-2">
            <UIDropdown
              placeholder="Select bot"
              value={bots
                .map((bot) => ({ value: bot.bot_name, name: bot.bot_name }))
                .find((el) => el.value === selectedBot.value)}
              options={bots.map((bot) => ({ value: bot.bot_name, name: bot.bot_name }))}
              onSelect={setSelectedBot}
            />
          </div>
        )}
        <ConversationsFilters filter={conversationsFilter} setFilter={setConversationsFilter} />
        {selectedBotConversations && (
          <ConversationsList
            conversations={selectedBotConversations}
            onSelect={setSelectedConversation}
          />
        )}
      </OpacityBox>
      {selectedConversation ? (
        <>
          <OpacityBox className="p-0 overflow-hidden col-span-3">
            <ConversationsChat botId={selectedBot.value} conversation={selectedConversation} />
          </OpacityBox>
          <OpacityBox className="px-4 py-0 overflow-hidden flex flex-col space-y-6 col-span-3">
            <ConversationsVisitor visitor={selectedConversation.visitor} />
          </OpacityBox>
        </>
      ) : (
        <div className="col-span-6 text-center h-full">
          <OpacityBox className="h-full flex items-center justify-center text-2xl">
            Select conversation from the list on the left side
          </OpacityBox>
        </div>
      )}
    </div>
  );
};
