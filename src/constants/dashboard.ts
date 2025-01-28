import { ChartData } from 'src/types/statistics';

type Test = keyof ChartData;

export const TABS: {
  name: string;
  id: string;
  info: string;
  disabled?: boolean;
  tabParamName?: Exclude<Test, 'historical_data'>;
}[] = [
  {
    name: 'Total Messages',
    id: 'totalMessages',
    tabParamName: 'total_messages',
    info: 'The total number of messages sent in the group within a selected time period',
  },
  {
    name: 'Message by Type',
    id: 'messageByType',
    info: 'The total number of messages sent by the bot within a selected time period, categorized by different types or categories of messages.',
    disabled: true,
  },
  {
    name: 'Active Users',
    id: 'activeUsers',
    info: 'Individuals who engage or interact with a bot within a specific time period.',
    disabled: true,
  },
  {
    name: 'New Users',
    id: 'newUsers',
    info: 'Users who interacted with the bot for the first time within a specific time period.',
    disabled: true,
  },
  {
    name: 'Returning Users',
    id: 'returningUsers',
    info: 'Users who have interacted with the bot more than once within a specific period.',
    disabled: true,
  },
];
