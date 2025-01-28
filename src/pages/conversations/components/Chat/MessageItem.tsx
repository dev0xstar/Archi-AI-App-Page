// @ts-ignore
import markdownItClass from '@toycode/markdown-it-class';
// @ts-ignore
import markdownIt from 'markdown-it';
// @ts-ignore
import markdownItLinkAttributes from 'markdown-it-link-attributes';
// @ts-ignore
import markdownItSanitizer from 'markdown-it-sanitizer';
// @ts-ignore
import markdownItSup from 'markdown-it-sup';
import { FC } from 'react';
import { ConversationsUserAvatar } from 'src/pages/conversations/components/ConversationsUserAvatar';
import { BotChatHistoryMessage, Visitor } from 'src/types/conversation';

export const MessageItem: FC<{ message: BotChatHistoryMessage; visitor: Visitor }> = ({
  message,
  visitor,
}) => {
  const isAI = message.user_id === 'ai';

  const sanitizedHTML = markdownIt({ break: true })
    .use(markdownItClass, {
      img: ['rcw-message-img'],
    })
    .use(markdownItSup)
    .use(markdownItSanitizer)
    .use(markdownItLinkAttributes, { attrs: { target: '_blank', rel: 'noopener' } })
    .render(message.content);

  return (
    <div
      className={`message-container items-start flex w-10/12 mb-6 ${
        !isAI ? 'justify-start mr-auto' : 'justify-end flex-row-reverse ml-auto'
      }`}
    >
      {!isAI && (
        <div className="w-8 h-8 ml-2 -mt-1">
          <ConversationsUserAvatar visitor={visitor} />
        </div>
      )}
      <div
        className={`bg-white bg-opacity-10 p-2 rounded-xl ${
          !isAI ? 'mr-auto rounded-tl-none ml-2' : 'ml-auto mr-2 rounded-br-none'
        }`}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      ></div>
    </div>
  );
};
