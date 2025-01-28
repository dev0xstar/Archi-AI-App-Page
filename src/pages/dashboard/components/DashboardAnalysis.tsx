import classNames from 'classnames';
import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { UITooltip } from 'src/components/UI/UITooltip';
import { TABS } from 'src/constants/dashboard';
import { DashboardPlots } from 'src/pages/dashboard/components/DashboardPlots';
import { ChartData, CurrentTab, Stats } from 'src/types/statistics';

export const DashboardAnalysis: FC<{ chartData: ChartData; stats: Stats }> = ({
  chartData,
  stats,
}) => {
  return (
    <OpacityBox className="mt-6 flex-1">
      <div className="flex space-x-8 h-full items-stretch">
        <Tabs stats={stats} />
        <div className="flex-1 h-full">
          <DashboardPlots data={chartData.historical_data} />
        </div>
      </div>
    </OpacityBox>
  );
};

const Tabs: FC<{ stats: Stats }> = ({ stats }) => {
  const [searchParams] = useSearchParams();
  const currentTab: CurrentTab = (searchParams.get('tab') as CurrentTab) || TABS[0].id;

  return (
    <>
      <div className="flex-shrink-0">
        <div className="text-xl mb-8">XC Interactions</div>
        {TABS.map((tab) => (
          <TabsItem stats={stats} key={tab.id} currentTab={currentTab} tab={tab} />
        ))}
      </div>
    </>
  );
};

const TabsItem: FC<{ tab: (typeof TABS)[number]; currentTab: string; stats: Stats }> = ({
  tab,
  currentTab,
  stats,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // const isDynamicNegative = tab.dynamic.startsWith('-');

  const changeTabHandler = (value: CurrentTab) => {
    searchParams.set('tab', value);
    setSearchParams(searchParams);
  };

  const tabClassNames = classNames({
    'bg-white border-white text-black': currentTab === tab.id,
    'bg-transparent border-white border-opacity-40 [&_span]:opacity-40': currentTab !== tab.id,
    'border rounded-2xl flex items-center p-3 mt-2 cursor-pointer': true,
    'hover:opacity-100': !tab.disabled,
  });

  return (
    <div
      className={tabClassNames}
      onClick={() => (!tab.disabled ? changeTabHandler(tab.id) : null)}
    >
      <span className="mr-20">{tab.name}</span>
      <div className="flex items-center space-x-4 ml-auto">
        <span className="">
          {tab.disabled ? 'TBA' : tab.tabParamName ? stats[tab.tabParamName] : 'TBA'}
        </span>
        {/*<span className="">{tab.value}</span>*/}
        {/*{isDynamicNegative ? (*/}
        {/*  <span className="px-1 py-0.5 bg-[#ED1522] text-[#ED1522] bg-opacity-10 rounded-md">*/}
        {/*    <span className="-mb-[1px] block">{tab.dynamic}</span>*/}
        {/*  </span>*/}
        {/*) : (*/}
        {/*  <span className="px-1 py-0.5 bg-[#52C41A] text-[#52C41A] bg-opacity-10 rounded-md">*/}
        {/*    <span className="-mb-[1px] block">{tab.dynamic}</span>*/}
        {/*  </span>*/}
        {/*)}*/}
        <UITooltip message={tab.info} backgroundColor="rgba(225, 225, 225, 0.99)" />
      </div>
    </div>
  );
};
