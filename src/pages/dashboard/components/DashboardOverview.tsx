import { Icon } from '@iconify/react';
import { FC, ReactNode } from 'react';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { Stats } from 'src/types/statistics';
import { shortenNumber } from 'src/utils/bigNumber';

const STATS_LIST: {
  name: string;
  value: string;
  dynamic: string;
  unitOfMeasurement?: string;
  statKey: keyof Stats;
  precision: number;
  icon: ReactNode;
}[] = [
  {
    name: 'Engagement Rate',
    value: '3.5%',
    dynamic: '+2%',
    unitOfMeasurement: '%',
    statKey: 'engagement_rate',
    precision: 2,
    icon: <Icon icon="fa6-solid:face-smile" />,
  },
  {
    name: 'Total Users',
    value: '43',
    dynamic: '+1%',
    statKey: 'total_users',
    precision: 0,
    icon: <Icon icon="fa6-solid:user" />,
  },
  {
    name: 'Hours Saved',
    value: '1,058',
    dynamic: '+2%',
    statKey: 'hours_saved',
    precision: 2,
    icon: <Icon icon="fa6-solid:clock" />,
  },
  {
    name: 'Cost Saved',
    value: '$50.22K',
    unitOfMeasurement: '$',
    dynamic: '-3%',
    statKey: 'costs_saved',
    precision: 2,
    icon: <Icon icon="fa6-solid:sack-dollar" />,
  },
];

export const DashboardOverview: FC<{ stats: Stats }> = ({ stats }) => {
  return (
    <OpacityBox className="flex items-center">
      <h3 className="text-2xl col-span-1">Overview</h3>
      <div className="ml-auto flex items-center space-x-12">
        {STATS_LIST.map((stat) => (
          <Item
            key={stat.name}
            stat={{
              ...stat,
              value: shortenNumber(String(stats[stat.statKey] || 0), stat.precision),
            }}
          />
        ))}
      </div>
    </OpacityBox>
  );
};

const Item: FC<{ stat: (typeof STATS_LIST)[number] }> = ({ stat }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="rounded-full bg-white flex items-center justify-center text-black w-11 h-11 text-lg">
        {stat.icon}
      </div>
      <div className="">
        <div className="flex items-center space-x-2">
          <span className="text-xl">
            {stat.value}
            {stat.unitOfMeasurement}
          </span>
          {/*{isDynamicNegative ? (*/}
          {/*  <span className="px-1 py-0.5 bg-[#ED1522] text-[#ED1522] bg-opacity-10 rounded-md">*/}
          {/*    <span className="-mb-[1px] block">{stat.dynamic}</span>*/}
          {/*  </span>*/}
          {/*) : (*/}
          {/*  <span className="px-1 py-0.5 bg-[#52C41A] text-[#52C41A] bg-opacity-10 rounded-md">*/}
          {/*    <span className="-mb-[1px] block">{stat.dynamic}</span>*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
        <span className="opacity-40">{stat.name}</span>
      </div>
    </div>
  );
};
