import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

export const useTimeUntil = (end: number | string) => {
  const [pastTime, setPastTime] = useState('0');
  const interval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (end === 0 || end === '0') {
      setPastTime('0');
    }
    calculatePastTime();
    interval.current = setInterval(() => {
      calculatePastTime();
    }, 1000);

    return () => clearInterval(interval.current);
  }, [end]);

  function calculatePastTime() {
    const endTime = moment(Number(end) * 1000);
    const last = moment().utc();

    if (endTime.diff(last) < 0) {
      setPastTime('0');
      clearInterval(interval.current);
      return;
    }

    const diffMonth = endTime.diff(last, 'month');
    last.add(diffMonth, 'month');
    const diffDays = endTime.diff(last, 'days');
    last.add(diffDays, 'days');
    const diffHours = endTime.diff(last, 'hours');
    last.add(diffHours, 'hours');
    const diffMin = endTime.diff(last, 'minutes');
    last.add(diffMin, 'hours');
    const diffSec = endTime.diff(last, 'second');

    setPastTime(
      `${diffMonth ? `${diffMonth} month ` : ''}${diffDays ? `${diffDays} days ` : ''}${
        diffHours ? `${diffHours} hours ` : ''
      }${diffMin ? `${diffMin} min` : `${diffSec} sec`}`,
    );
  }

  return pastTime;
};
