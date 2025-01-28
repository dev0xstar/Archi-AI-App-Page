import { FC, isValidElement, ReactNode } from 'react';

type Props = {
  value: boolean;
  size?: 'lg';
  label?: string | ReactNode;
  onChange: (e: boolean) => void;
};

export const UISwitch: FC<Props> = ({ value, label, onChange, size }) => {
  return (
    <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onChange(!value)}>
      <div
        className={`relative ${size === 'lg' ? 'w-[54px] h-[26px]' : 'w-[32px] h-[18px]'} ${
          value ? 'bg-purple-600' : 'bg-gray-500'
        } rounded-full`}
      >
        <div
          className={`absolute ${
            size === 'lg' ? 'w-[22px] h-[22px]' : 'w-[14px] h-[14px]'
          } rounded-full left-[2px] top-[2px] transform transition-transform duration-200 ${
            value
              ? `${size === 'lg' ? 'translate-x-[26px]' : 'translate-x-[13px]'} bg-white`
              : 'translate-x-0 bg-gray-600'
          }`}
        ></div>
      </div>
      {isValidElement(label) ? (
        label
      ) : (
        <div className={size === 'lg' ? 'text-base' : ''}>{label}</div>
      )}
    </div>
  );
};
