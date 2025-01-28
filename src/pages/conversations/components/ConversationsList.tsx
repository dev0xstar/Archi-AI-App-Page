import { FC } from 'react';
import { ConversationsUserAvatar } from 'src/pages/conversations/components/ConversationsUserAvatar';
import { BotConversationsList } from 'src/types/conversation';

export const ConversationsList: FC<{
  conversations: BotConversationsList['last_messages'];
  onSelect: (conversation: BotConversationsList['last_messages'][number]) => void;
}> = ({ conversations, onSelect }) => {
  return (
    <div className="overflow-auto h-full">
      {conversations.map((el, i) => (
        <button
          key={`${el.visitor.name}_${i}`}
          onClick={() => onSelect(el)}
          className="w-full text-left flex items-stretch p-3 [&:not(:last-child)]:border-b border-white border-opacity-10 hover:bg-[#ffffff] hover:bg-opacity-5 cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8">
            <ConversationsUserAvatar visitor={el.visitor} />
          </div>
          <div className="flex flex-col content-between ml-4">
            <p>{el.visitor.name}</p>
            <p className="text-xs">{el.last_message.prev}</p>
          </div>
          <div className="flex flex-col content-between ml-auto">
            <p className="text-xxs opacity-40">12:43</p>
            {el.unread_msg_count && (
              <div className="w-5 h-5 flex items-center justify-center bg-gradient-to-r from-[#FB1FFF] to-[#8247FF] rounded-full text-xs">
                <span className="-mb-[1px]">{el.unread_msg_count}</span>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
