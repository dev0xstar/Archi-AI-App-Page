import { Icon } from '@iconify/react';
import { Dispatch, FC, SetStateAction } from 'react';
import { UIButton } from 'src/components/UI/UIButton';
import { BotKnowledgeBaseItem } from 'src/pages/my-bots/components/BotKnowledgeBaseItem';
import { useSetModal } from 'src/providers/ModalsProvider';
import { KnowledgeBaseItem, KnowledgeBaseNewItem } from 'src/types/bots';

type Props = {
  knowledgeBase: KnowledgeBaseItem[] | null;
  setKnowledgeBase: Dispatch<SetStateAction<KnowledgeBaseItem[] | null>>;
};

export const BotKnowledgeBase: FC<Props> = ({ knowledgeBase, setKnowledgeBase }) => {
  const setModal = useSetModal();

  const handleAdd = (settings: KnowledgeBaseNewItem) => {
    setKnowledgeBase((prevState) => {
      const newItem = {
        name: settings.name,
        id: settings.name,
        size: '120mb',
        type: settings.type,
        status: 'new',
      };

      setModal(null);

      if (!prevState) return [newItem];

      return [
        ...prevState,
        {
          name: settings.name,
          id: settings.name,
          size: '120mb',
          type: settings.type,
          status: 'new',
        },
      ];
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-lg">Knowledge Base Management</span>
        {knowledgeBase && knowledgeBase.length !== 0 && (
          <UIButton
            startIcon={<Icon icon="fa6-solid:plus" />}
            onClick={() => setModal({ key: 'add-knowledge', onAdd: handleAdd })}
          >
            Add Knowledge Base
          </UIButton>
        )}
      </div>
      {!knowledgeBase || knowledgeBase.length === 0 ? (
        <div className="flex flex-col justify-center items-center">
          <p className="text-lg text-center my-5">
            There are no Knowledge Bases assigned to this bot
          </p>
          <UIButton
            startIcon={<Icon icon="fa6-solid:plus" />}
            onClick={() => setModal({ key: 'add-knowledge', onAdd: handleAdd })}
          >
            Add Knowledge Base
          </UIButton>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex mb-4 px-4">
            <div className="w-6/12">Name</div>
            <div className="w-2/12">Type</div>
            <div className="w-2/12">Status</div>
            <div className="w-1/12">Size</div>
            <div className="w-1/12 text-right">Action</div>
          </div>
          <div className="flex flex-col">
            {knowledgeBase?.map((item) => <BotKnowledgeBaseItem key={item.id} item={item} />)}
          </div>
        </div>
      )}
    </div>
  );
};
