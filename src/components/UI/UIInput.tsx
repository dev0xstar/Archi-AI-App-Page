import { ChangeEvent, FC, ReactNode } from 'react';

// Extend Props to include 'rows' and an optional 'type' to switch between input and textarea
type Props = {
  name: string;
  value: string | null;
  placeholder?: string;
  label?: string;
  type?: 'input' | 'textarea';
  rows?: number;
  labelEnd?: ReactNode;
  onChange: (e: ChangeEvent<any>) => void;
};

export const UIInput: FC<Props> = ({
  onChange,
  name,
  placeholder,
  value,
  label,
  labelEnd,
  type = 'input',
  rows = 5,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        {label && <label htmlFor={name}>{label}</label>}
        {labelEnd}
      </div>
      {type === 'input' ? (
        <input
          type="text"
          id={name}
          className="flex-1 bg-transparent placeholder-gray-400 border border-gray-600 focus:border-blue-500 rounded-xl py-2 px-4 focus:outline-none"
          value={value || ''}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
        />
      ) : (
        <textarea
          id={name}
          className="flex-1 bg-transparent resize-none placeholder-gray-400 border border-gray-600 focus:border-blue-500 rounded-xl py-2 px-4 focus:outline-none"
          value={value || ''}
          name={name}
          placeholder={placeholder}
          rows={rows}
          onChange={onChange}
        />
      )}
    </div>
  );
};
