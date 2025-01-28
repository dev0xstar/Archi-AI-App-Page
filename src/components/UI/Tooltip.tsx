import { Icon } from '@iconify/react';
import { FC, ReactNode } from 'react';

export const Tooltip: FC<{ text: string | ReactNode }> = ({ text }) => {
  return (
    <div className="relative group ml-2">
      <div className="relative">
        <div
          style={{
            width: 'calc(100% + 2rem)',
            height: 'calc(100% + 2rem)',
            right: '-1rem',
            bottom: '-1rem',
          }}
          className="absolute cursor-pointer"
        ></div>
        <Icon icon="fa6-solid:circle-question" />
      </div>
      <div
        style={{ bottom: 'calc(100% + 1rem)' }}
        className="absolute hidden group-hover:block z-10 w-64 px-4 py-2 bg-white text-black rounded-lg shadow-lg left-1/2 -translate-x-1/2"
      >
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
        {text}
      </div>
    </div>
  );
};
