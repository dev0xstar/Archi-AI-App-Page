import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Modal } from 'src/components/UI/Modal';
import { UIButton } from 'src/components/UI/UIButton';
import { UICheckbox } from 'src/components/UI/UICheckbox';
import { UIDropdown } from 'src/components/UI/UIDropdown';
import { UIDropZone } from 'src/components/UI/UIDropZone';
import { UIInput } from 'src/components/UI/UIInput';
import { BASE_TYPES } from 'src/constants/knowledgeBase';
import { useSetModal } from 'src/providers/ModalsProvider';
import { KnowledgeBaseNewItem } from 'src/types/bots';
import { AddKnowledgeBaseModalSettings } from 'src/types/modal';

const INIT_FORM_STATE = {
  type: '',
  name: '',
  webSiteLink: '',
  youtubeLink: '',
  scrape: false,
  txt: '',
};

type DynamicFormComponent = {
  settings: Omit<KnowledgeBaseNewItem, 'type'>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const AddKnowledgeBaseModal: FC<AddKnowledgeBaseModalSettings> = ({ onAdd }) => {
  const setModal = useSetModal();

  const [type, setType] = useState<any>(BASE_TYPES[0]);
  const [settings, setSettings] = useState<Omit<KnowledgeBaseNewItem, 'type'>>(INIT_FORM_STATE);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;

    setSettings({
      ...settings,
      [name]: event.target.type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddBase();
  };

  const handleAddBase = () => {
    onAdd({ ...settings, type: type.value });
  };

  return (
    <Modal size="lg">
      <div className="modal-title">Add Base</div>
      <form onSubmit={handleSubmit}>
        <div className="text-black flex flex-col space-y-4">
          <UIDropdown value={type} options={BASE_TYPES} onSelect={setType} label="Type" />
          <UIInput
            label="Name"
            name="name"
            value={settings.name}
            placeholder="Base name"
            onChange={handleInputChange}
          />
          {type.value === 'website' && (
            <WebSiteForm settings={settings} onChange={handleInputChange} />
          )}
          {type.value === 'file' && <FileForm settings={settings} onChange={handleInputChange} />}
          {type.value === 'video' && <VideoForm settings={settings} onChange={handleInputChange} />}
          {type.value === 'txt' && <TxtForm settings={settings} onChange={handleInputChange} />}
        </div>
        <div className="flex space-x-4 mt-10">
          <UIButton
            buttonType="stroke"
            className="text-gray-600 w-full"
            onClick={() => setModal(null)}
          >
            Cancel
          </UIButton>
          <UIButton className="w-full" onClick={handleAddBase}>
            Add
          </UIButton>
        </div>
      </form>
    </Modal>
  );
};

const WebSiteForm: FC<DynamicFormComponent> = ({ settings, onChange }) => {
  return (
    <>
      <UIInput
        label="Link"
        name="webSiteLink"
        value={settings.webSiteLink}
        placeholder="Link"
        onChange={onChange}
      />
      <UICheckbox
        name="scrape"
        label="Scrape whole website"
        checked={settings.scrape}
        onChange={onChange}
      />
    </>
  );
};

const FileForm: FC<DynamicFormComponent> = () => {
  return (
    <>
      <UIDropZone />
    </>
  );
};

const VideoForm: FC<DynamicFormComponent> = ({ settings, onChange }) => {
  return (
    <>
      <UIInput
        name="youtubeLink"
        value={settings.youtubeLink}
        placeholder="Youtube link"
        onChange={onChange}
        label="Youtube link"
      />
    </>
  );
};

const TxtForm: FC<DynamicFormComponent> = ({ settings, onChange }) => {
  return (
    <>
      <UIInput
        label="Text"
        type="textarea"
        name="txt"
        value={settings.txt}
        placeholder="Text field"
        onChange={onChange}
      />
    </>
  );
};
