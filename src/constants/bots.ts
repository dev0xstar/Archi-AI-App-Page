import { BotSettingsType, StaticBot } from 'src/types/bots';

export const BOTS: StaticBot[] = [
  {
    id: 'xc',
    name: 'AI Community Manager',
    description:
      'Boost community interaction with AigentXC, delivering 24/7 support and multilingual engagement through advanced AI-driven management.',
    imageUrl: '/images/bot-xc-bg.webp',
    modalKey: 'xc-tariffs',
    buttonLabel: 'See Tariffs',
  },
  {
    id: 'xt',
    name: 'AI Trading Agent ',
    description:
      'Gain a competitive edge in trading with AigentXT, offering AI-powered real-time blockchain data analysis and smart contract security insights for informed investment decisions.',
    imageUrl: '/images/bot-xt-bg.webp',
    modalKey: 'xt-tariffs',
    buttonLabel: 'Get Plan',
  },
  {
    id: 'xo',
    name: 'AI Care Agent',
    label: 'Enterprise solution',
    description:
      'Unlock the power of digital support managers and scalable client service with 24/7 instant high-quality relevant responses in 100+ languages.',
    imageUrl: '/images/bot-xo-bg.webp',
    modalKey: 'xo-tariffs',
    buttonLabel: 'Get Plan',
  },
];

export const INIT_BOT_SETTINGS: BotSettingsType = {
  // name: '',
  how_to_buy: '',
  company_info: '',
  contracts: '',
  coingecko: '',
  dex_tools_link: '',
  dex_screener: '',
  ton_of_voice: 'friendly',
  token_info: '',
  verified: '',
  website: '',
  autoreply: 'false',
} as const;

export const ITEMS_INTEGRATIONS = [
  {
    icon: '/images/icon-integr-code.png',
    name: 'Webchat',
    id: 'webchat',
    connected: false,
  },
  {
    icon: '/images/icon-integr-telegram.png',
    name: 'Telegram',
    id: 'telegram',
    connected: false,
  },
  {
    icon: '/images/icon-integr-discord.png',
    name: 'Discord',
    id: 'discord',
    connected: false,
    disabled: true,
  },
  {
    icon: '/images/icon-integr-whatsapp.png',
    name: 'WhatsApp',
    id: 'whatsApp',
    connected: false,
    disabled: true,
  },
  {
    icon: '/images/icon-integr-inst.png',
    name: 'Instagram',
    id: 'instagram',
    connected: false,
    disabled: true,
  },
  {
    icon: '/images/icon-integr-fb.png',
    name: 'Messenger',
    id: 'messenger',
    connected: false,
    disabled: true,
  },
];
