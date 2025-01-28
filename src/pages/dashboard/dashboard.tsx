import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker, { DateRangeType, DateValueType } from 'react-tailwindcss-datepicker';
import { LoadingStub } from 'src/components/UI/LoadingStub';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { UIDropdown } from 'src/components/UI/UIDropdown';
import { BOTS_API_URL } from 'src/configs/api.config';
import { DashboardAnalysis } from 'src/pages/dashboard/components/DashboardAnalysis';
import { DashboardOverview } from 'src/pages/dashboard/components/DashboardOverview';
import { useBots } from 'src/providers/BotsProvider';
import { ChartData, Stats } from 'src/types/statistics';

const FILTER_OPTIONS = {
  showBy: [
    { name: '24H', value: '1' },
    { name: 'Last week', value: '7' },
    { name: 'Last month', value: '30' },
    { name: 'Last 3 months', value: '90' },
    { name: 'Last 6 months', value: '180' },
    { name: 'Last year', value: '365' },
    { name: 'Custom', value: 'custom', hide: true },
  ],
};

const INITIAL_STATS_STATE = {
  stats: null,
  fetching: true,
} as const;

const INITIAL_PLOTS_DATA_STATE = {
  stats: null,
  fetching: true,
} as const;

const INIT_FILTERS = {
  byBotId: undefined,
  showBy: FILTER_OPTIONS.showBy[1].value,
  time: {
    startDate: moment(new Date().getTime()).format('YYYY-MM-DD'),
    endDate: moment(new Date().setMonth(2)).format('YYYY-MM-DD'),
  },
};

type StatsState = { stats: null; fetching: true } | { stats: Stats; fetching: false };
type PlotsState = { stats: null; fetching: true } | { stats: ChartData; fetching: false };
type Filters = {
  byBotId?: string;
  showBy: (typeof FILTER_OPTIONS.showBy)[number]['value'];
  time: DateRangeType;
};

export const Dashboard = () => {
  const { bots, fetchingBots } = useBots();

  const [filters, setFilters] = useState<Filters>(INIT_FILTERS);
  const [stats, setStats] = useState<StatsState>(INITIAL_STATS_STATE);
  const [plotData, setPlotData] = useState<PlotsState>(INITIAL_PLOTS_DATA_STATE);

  useEffect(() => {
    if (!bots || !bots[0]) {
      setFilters(INIT_FILTERS);
      return;
    }

    setFilters((prevState) => ({
      ...prevState,
      byBotId: bots[0].id,
    }));
  }, [bots]);

  useEffect(() => {
    setFilters((prevState) => {
      const {
        time: { startDate, endDate },
        showBy,
      } = prevState;
      const endDateDayIsCurrentDay = moment().isSame(moment(endDate, 'YYYY-MM-DD'), 'day');

      if (!endDateDayIsCurrentDay) return prevState;

      const daysDiff = Math.abs(moment(startDate).diff(moment(), 'days'));

      const existingDateRange = FILTER_OPTIONS.showBy.find(
        (el) => el.value === daysDiff.toString(),
      );

      const newShowByState = existingDateRange ? existingDateRange.value : 'custom';

      // Only update state if necessary
      if (newShowByState === showBy) {
        return prevState;
      }

      return {
        ...prevState,
        showBy: newShowByState,
      };
    });
  }, [filters.time]);

  useEffect(() => {
    fetchPlotData();
    fetchStats();
  }, [filters.time, filters.byBotId]);

  useEffect(() => {
    setFilters((prevState) => {
      const {
        showBy,
        time: { startDate, endDate },
      } = prevState;

      const newEndDate = moment().format('YYYY-MM-DD');
      const newStartDate = moment().subtract(showBy, 'd').format('YYYY-MM-DD');

      if (startDate === newStartDate && endDate === newEndDate) return prevState;

      return {
        ...prevState,
        time: { startDate: newStartDate, endDate: newEndDate },
      };
    });
  }, [filters.showBy]);

  const fetchStats = async () => {
    const {
      byBotId,
      time: { startDate, endDate },
    } = filters;

    if (!byBotId) {
      setStats(INITIAL_STATS_STATE);
      return;
    }

    try {
      setStats({ stats: null, fetching: true });
      const response = await axios.get<{ result: ChartData }>(
        `${BOTS_API_URL}/statistics/summary/${byBotId}?start_date=${moment(startDate).format(
          'DD.MM.YYYY',
        )}&end_date=${moment(endDate).format('DD.MM.YYYY')}`,
      );
      setStats({ fetching: false, stats: response.data.result });
    } catch (e) {
      console.error('Failed to fetch stats:', e);
      setPlotData(INITIAL_PLOTS_DATA_STATE);
    }
  };

  const fetchPlotData = async () => {
    const {
      byBotId,
      time: { startDate, endDate },
    } = filters;

    if (!byBotId) {
      setPlotData(INITIAL_PLOTS_DATA_STATE);
      return;
    }

    try {
      setPlotData({ stats: null, fetching: true });
      const response = await axios.get<{ result: ChartData }>(
        `${BOTS_API_URL}/getStatistics/${byBotId}?start_date=${moment(startDate).format(
          'DD.MM.YYYY',
        )}&end_date=${moment(endDate).format('DD.MM.YYYY')}`,
      );
      setPlotData({ fetching: false, stats: response.data.result });
    } catch (e) {
      console.error('Failed to fetch stats:', e);
      setPlotData(INITIAL_PLOTS_DATA_STATE);
    }
  };

  const handleFilterSelect =
    <T extends keyof typeof FILTER_OPTIONS | 'byBotId'>(name: T) =>
    (option: { value: string; name: string }) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: option.value,
      }));
    };

  const handleDateChange = (newValue: DateValueType) => {
    if (!newValue) return;

    setFilters((prevState) => ({
      ...prevState,
      time: newValue,
    }));
  };

  if (fetchingBots) return <LoadingStub label="Loading bots..." containerSize="full" />;

  if (!bots || bots.length === 0)
    return (
      <OpacityBox className="flex flex-1 h-full flex-col items-center justify-center space-y-4">
        <p>You need to create bot first</p>
      </OpacityBox>
    );

  return (
    <>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        {/*<UIButton startIcon={<Icon icon="fa6-solid:download" />}>Export CSV</UIButton>*/}
      </div>
      <div className="flex items-center justify-items-stretch space-x-4 my-6">
        <div className="flex-[2]">
          <UIDropdown
            label="Sort by bot:"
            value={bots
              .map((bot) => ({ value: bot.id, name: bot.name }))
              .find((el) => el.value === filters.byBotId)}
            options={bots.map((bot) => ({ value: bot.id, name: bot.name }))}
            onSelect={handleFilterSelect('byBotId')}
          />
        </div>
        <div className="flex-[2]">
          <UIDropdown
            label="Show by:"
            value={FILTER_OPTIONS.showBy.find((el) => el.value === filters.showBy)}
            options={FILTER_OPTIONS.showBy}
            onSelect={handleFilterSelect('showBy')}
          />
        </div>
        <div className="flex flex-col space-y-2 flex-1">
          <span>Custom Date Range:</span>
          <Datepicker
            primaryColor="purple"
            inputClassName="bg-transparent w-full placeholder-gray-400 border border-gray-600 focus:border-blue-500 rounded-xl py-2 px-4 focus:outline-none text-white"
            value={{ startDate: filters.time.startDate, endDate: filters.time.endDate }}
            onChange={handleDateChange}
            showShortcuts
            showFooter
            separator={'-'}
          />
        </div>
      </div>

      {plotData.fetching || stats.fetching ? (
        <LoadingStub label="Loading statistics..." containerSize="full" />
      ) : (
        <>
          <DashboardOverview stats={stats.stats} />
          <DashboardAnalysis stats={stats.stats} chartData={plotData.stats} />
        </>
      )}
    </>
  );
};
