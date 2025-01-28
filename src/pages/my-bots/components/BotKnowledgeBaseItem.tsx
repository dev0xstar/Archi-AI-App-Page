import { Icon } from '@iconify/react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetModal } from 'src/providers/ModalsProvider';
import { KnowledgeBaseItem } from 'src/types/bots';

export const BotKnowledgeBaseItem: FC<{ item: KnowledgeBaseItem }> = ({ item }) => {
  const setModal = useSetModal();
  const navigate = useNavigate();

  const deleteItemHandler = () => {
    setModal({
      key: 'confirm',
      body: undefined,
      cancelText: undefined,
      confirmText: 'Delete',
      danger: true,
      size: 'md',
      title: 'You want to delete the knowledge base item?',
      onConfirm: () => {},
    });
  };

  return (
    <div
      className="flex items-center rounded-xl p-4 odd:bg-white odd:bg-opacity-5 cursor-pointer"
      onClick={() => navigate(item.id)}
    >
      <div className="flex items-center space-x-3 w-6/12">
        <div className="text-white">{item.name}</div>
      </div>
      <div className="w-2/12">{item.type}</div>
      <div className="w-2/12">{item.status}</div>
      <div className="w-1/12">{item.size}</div>
      <div className="w-1/12 text-right flex items-center space-x-2 justify-end">
        <Icon className="cursor-pointer" icon="fa6-solid:eye" />
        <Icon className="cursor-pointer" icon="fa6-solid:pen" />
        <Icon
          className="cursor-pointer"
          icon="fa6-solid:trash-can"
          onClick={(e) => {
            e.stopPropagation();
            deleteItemHandler();
          }}
        />
      </div>
    </div>
  );
};
