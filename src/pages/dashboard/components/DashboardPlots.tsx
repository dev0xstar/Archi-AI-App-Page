import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import ReactApexChart, { Props as ReactApexChartProps } from 'react-apexcharts';
import { useSearchParams } from 'react-router-dom';
import { LoadingStub } from 'src/components/UI/LoadingStub';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { TABS } from 'src/constants/dashboard';
import { ChartData, CurrentTab } from 'src/types/statistics';

const INITIAL_PLOT_SETTINGS = {
  type: 'line' as ReactApexChartProps['type'],
  series: [],
};

export const DashboardPlots: FC<{
  data: ChartData['historical_data'] | [];
}> = ({ data }) => {
  const [searchParams] = useSearchParams();
  const currentTab: CurrentTab = (searchParams.get('tab') as CurrentTab) || TABS[0].id;

  const [plotSettings, setPlotSettings] = useState<{
    type: ReactApexChartProps['type'];
    series: ApexAxisChartSeries;
  }>(INITIAL_PLOT_SETTINGS);
  const [processingPlot, setProcessingPlot] = useState(true);

  useEffect(() => {
    if (!data || !data[0]) {
      setProcessingPlot(false);
      return;
    }
    setProcessingPlot(true);

    let type: ReactApexChartProps['type'] = 'line';
    const plotData: [number, number][] = [];

    switch (currentTab) {
      case 'totalMessages': {
        type = 'line';
        data.forEach((el) => plotData.push([el.timestamp * 1000, el.total_messages]));
        break;
      }
      default: {
        break;
      }
    }

    setPlotSettings({ type, series: [{ data: plotData }] });
    setProcessingPlot(false);
  }, [data]);

  if (!plotSettings) return <LoadingStub label="Loading statistics..." containerSize="full" />;

  if (processingPlot) return <LoadingStub label="Building a plot..." containerSize="full" />;

  if (data.length === 0)
    return (
      <OpacityBox className="flex flex-1 h-full flex-col items-center justify-center space-y-4">
        <p>No data to show</p>
      </OpacityBox>
    );

  return (
    <ReactApexChart
      type={plotSettings.type}
      height="100%"
      options={{
        tooltip: {
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            return `<div class="custom-apexcharts-tooltip text-black px-1 py-2 text-center"><div class="text-xl">${
              series[seriesIndex][dataPointIndex]
            }</div><div class="opacity-40 text-xs">${moment(
              w.config.series[seriesIndex].data[dataPointIndex][0],
            ).format('DD.MM.YYYY')}</div></div>`;
          },
        },
        grid: {
          borderColor: 'rgba(225, 225, 225, 0.2)',
          show: true,
          xaxis: {
            lines: { show: true },
          },
        },
        xaxis: {
          type: 'datetime',
          axisBorder: {
            show: false,
          },
          axisTicks: { show: false },
          labels: {
            style: {
              colors: 'rgba(225, 225, 225, 0.2)',
            },
            datetimeUTC: false,
            format: 'dd/MM/yy',
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: { show: false },
          labels: {
            style: {
              colors: 'rgba(225, 225, 225, 0.2)',
            },
          },
        },
        markers: {
          size: 0,
          colors: ['#8247FF'],
          strokeColors: '#fff',
          strokeWidth: 3,
          hover: {
            size: 7,
            sizeOffset: 3,
          },
        },
        chart: {
          zoom: {
            enabled: false,
          },
          type: 'area',
          stacked: true,
          toolbar: { show: false },
        },
        colors: ['#FB1FFF'],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#8247FF'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
      }}
      series={plotSettings.series}
    />
  );
};
