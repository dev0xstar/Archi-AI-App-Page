import { Dispatch, FC } from 'react';
import { CONVERSATIONS_FILTERS } from 'src/constants/conversations';

type Props = {
  filter: string;
  setFilter: Dispatch<React.SetStateAction<string>>;
};

export const ConversationsFilters: FC<Props> = ({ filter, setFilter }) => {
  const handleFilterClick = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="px-4 pt-2 flex items-center">
      {CONVERSATIONS_FILTERS.map((el) => (
        <div key={el.value} className="flex-1 pb-4">
          <button
            className={`py-2 border-b-2 text-center cursor-pointer w-full ${
              filter === el.value ? '' : 'opacity-40'
            }`}
            onClick={() => handleFilterClick(el.value)}
          >
            {el.name}
          </button>
        </div>
      ))}
    </div>
  );
};
