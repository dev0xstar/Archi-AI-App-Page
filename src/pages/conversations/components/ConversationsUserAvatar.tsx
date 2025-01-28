import { Icon } from '@iconify/react';
import { FC, SVGProps } from 'react';
import DiscordIcon from 'src/assets/images/discord-avatar-flag.svg?react';
import GlobalIcon from 'src/assets/images/global-avatar-flag.svg?react';
import TgIcon from 'src/assets/images/tg-avatar-flag.svg?react';
import WpIcon from 'src/assets/images/wp-avatar-flag.svg?react';
import { default as CONVERSATIONS_ITEMS } from 'src/dummyDate/conversationsItems.json';
import { Visitor } from 'src/types/conversation';

const sourceIcons: Record<
  (typeof CONVERSATIONS_ITEMS)[number]['source'],
  FC<SVGProps<SVGSVGElement>>
> = {
  tg: TgIcon,
  wp: WpIcon,
  discord: DiscordIcon,
  default: GlobalIcon,
};

export const ConversationsUserAvatar: FC<{ visitor: Visitor }> = ({ visitor }) => {
  const SourceIcon = sourceIcons[visitor.source] || sourceIcons.default;

  return (
    <div className="relative self-center w-full h-full">
      <div className="absolute rounded-full w-full h-full overflow-hidden">
        {visitor.avatar ? (
          <img className="w-full left-0 top-0" src={visitor.avatar} alt="avatar" />
        ) : (
          <div className="w-full h-full bg-white flex items-center justify-center text-gray-400">
            <Icon className="w-1/2" icon="fa6-solid:user" />
          </div>
        )}
      </div>
      <div className="absolute right-0 bottom-0 w-4/12">
        <SourceIcon />
      </div>
    </div>
  );
};
