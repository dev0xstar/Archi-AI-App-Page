import { Icon } from '@iconify/react';
import { FC, useEffect, useState } from 'react';
import { UIDropdown } from 'src/components/UI/UIDropdown';
import { useCRMApi } from 'src/hooks/useCRMApi';
import { ChatFooter } from 'src/pages/conversations/components/Chat/ChatFooter';
import { MessageItem } from 'src/pages/conversations/components/Chat/MessageItem';
import { BotChatHistory, BotConversationsList } from 'src/types/conversation';
import { Nullable } from 'src/types/objectHelpers';

const PAUSE_OPTIONS = [
  {
    name: 'Automatically',
    value: 'auto',
  },
  {
    name: '5 min',
    value: '5',
  },
  {
    name: '30 min',
    value: '30',
  },
  {
    name: '1 hour',
    value: '60',
  },
  {
    name: 'Forever',
    value: 'forever',
  },
];

export const ConversationsChat: FC<{
  botId: string;
  conversation: BotConversationsList['last_messages'][number];
}> = ({ botId, conversation }) => {
  const [pausePeriod, setPausePeriod] = useState(PAUSE_OPTIONS[0]);
  const [chatHistory, setChatHistory] = useState<Nullable<BotChatHistory['messages']>>(null);
  const { fetchBotChatHistory } = useCRMApi();

  useEffect(() => {
    getChatHistory();
  }, [conversation]);

  async function getChatHistory() {
    const resp = await fetchBotChatHistory(conversation.chat_id);
    if (!resp) setChatHistory(null);
    else setChatHistory(resp.messages);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white bg-opacity-5 flex items-center justify-between">
        <span className="">Pause bot</span>
        <div className="flex-shrink-0 w-32">
          <UIDropdown
            value={pausePeriod}
            options={PAUSE_OPTIONS}
            onSelect={setPausePeriod}
            ToggleButton={({ isOpen }) => (
              <div className="flex justify-end items-center space-x-2 -mt-2">
                <span>{pausePeriod.name}</span>
                <Icon icon={`${isOpen ? 'fa6-solid:caret-up' : 'fa6-solid:caret-down'}`} />
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex flex-col w-full overflow-auto flex-grow pt-6 pb-4">
        {!chatHistory
          ? null
          : chatHistory.map((el) => <MessageItem message={el} visitor={conversation.visitor} />)}
      </div>
      <ChatFooter />
    </div>
  );
};
