import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingStub } from 'src/components/UI/LoadingStub';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { SectionTitle } from 'src/components/UI/SectionTitle';
import { UIButton } from 'src/components/UI/UIButton';
import { UIDropdown } from 'src/components/UI/UIDropdown';
import { UIInput } from 'src/components/UI/UIInput';
import { BASE_TYPES } from 'src/constants/knowledgeBase';
import { useBotsApi } from 'src/hooks/useBotsApi';
import { KnowledgeBaseById } from 'src/types/bots';

export const KnowledgeBaseId = () => {
  const { knowledgeBaseId, botId } = useParams() as { knowledgeBaseId: string; botId: string };
  const navigate = useNavigate();
  const { fetchKnowledgeBase } = useBotsApi();

  const [base, setBase] = useState<KnowledgeBaseById | null>(null);
  const [fetchingBase, setFetchingBase] = useState(true);
  const [shadowBase, setShadowBase] = useState<KnowledgeBaseById | null>(null);

  useEffect(() => {
    init();
  }, [knowledgeBaseId]);

  const init = async () => {
    setFetchingBase(true);

    const result = await fetchKnowledgeBase(botId, knowledgeBaseId);

    setBase(result);
    setShadowBase(result);
    setFetchingBase(false);
  };

  const handleBaseParamChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setShadowBase((prevState) => {
      if (!prevState) return prevState;

      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const setType = (type: { name: string; value: any }) => {
    setShadowBase((prevState) => {
      if (!prevState) return prevState;

      return {
        ...prevState,
        type: type.value,
      };
    });
  };

  if (!shadowBase || fetchingBase) return <LoadingStub label="Loading knowledge base..." />;

  return (
    <>
      <SectionTitle>Knowledge Base</SectionTitle>
      <OpacityBox className="mt-10 flex-1 flex flex-col">
        <h3 className="text-xl">Knowledge Base Management</h3>
        <div className="flex mt-10 space-x-4">
          <div className="flex-1">
            <UIInput
              name="filename"
              label="Source Name"
              value={shadowBase?.filename}
              placeholder="Source Name"
              onChange={handleBaseParamChange}
            />
          </div>
          <div className="flex-1">
            <UIDropdown
              value={BASE_TYPES.find((el) => el.value === shadowBase.type)}
              options={BASE_TYPES}
              onSelect={setType}
              label="Type"
            />
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="mt-6 flex-1 [&_textarea]:h-full [&>div]:h-full">
          <UIInput
            type="textarea"
            name="text"
            label="Content"
            value={shadowBase.text}
            onChange={handleBaseParamChange}
          />
        </div>
        <div className="mt-10 text-right">
          <UIButton
            color="gray"
            className="mr-4 w-32"
            onClick={() => navigate(`/my-bots/${botId}?&step=2`)}
          >
            Cancel
          </UIButton>
          <UIButton
            disabled={JSON.stringify(base) === JSON.stringify(shadowBase)}
            className="w-32"
            onClick={() => null}
          >
            Save
          </UIButton>
        </div>
      </OpacityBox>
    </>
  );
};
