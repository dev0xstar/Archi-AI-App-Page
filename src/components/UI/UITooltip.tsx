import { Icon } from '@iconify/react';
import { FC, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

export const UITooltip: FC<{ message: string; backgroundColor?: string }> = ({
  message,
  backgroundColor,
}) => {
  const id = useRef(uuidv4());

  return (
    <div className="relative cursor-pointer">
      <div
        data-tooltip-id={id.current}
        data-tooltip-content={message}
        className="absolute w-5 h-5 right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2"
      ></div>
      <Tooltip
        id={id.current}
        className="!opacity-100"
        style={{
          color: '#000',
          backgroundColor: backgroundColor || 'rgba(255,255,255, 1)',
          width: '300px',
          borderRadius: '14px',
          zIndex: 10,
        }}
      />
      <Icon className="text-gray-400" icon="fa6-solid:circle-question" />
    </div>
  );
};
