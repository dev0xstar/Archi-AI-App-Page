import { Icon } from '@iconify/react';
import { ChangeEvent, FC, useState } from 'react';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { UIDropdownMenu } from 'src/components/UI/UIDropdownMenu';
import { UIInput } from 'src/components/UI/UIInput';
import { ConversationsUserAvatar } from 'src/pages/conversations/components/ConversationsUserAvatar';
import { BotConversationsList } from 'src/types/conversation';

export const ConversationsVisitor: FC<{
  visitor: BotConversationsList['last_messages'][number]['visitor'];
}> = ({ visitor }) => {
  const [visitorSettings, setVisitorSettings] = useState(visitor);
  const [botSettings, setBotSettings] = useState({ summary: '', notes: '' });
  const [tags, setTags] = useState(['tag 1', 'tag 2', 'tag 3', 'tag 4', 'tag 5']);

  const MENU_ITEMS = [
    {
      name: 'Download Contact Data',
      onClick: downloadContactData,
    },
    {
      name: <div className="text-red-600">Delete Contact</div>,
      onClick: deleteContact,
    },
  ];

  function downloadContactData() {}

  function deleteContact() {}

  const handleVisitorSettingsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;

    setBotSettings({
      ...botSettings,
      [name]: event.target.type === 'checkbox' ? checked : value,
    });
  };

  const handleBotSettingsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;

    setVisitorSettings({
      ...visitorSettings,
      [name]: event.target.type === 'checkbox' ? checked : value,
    });
  };

  const handleTagRemoval = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddTag = () => {};

  return (
    <>
      <div className="p-4 -mx-4 bg-white bg-opacity-5 flex items-center justify-between">
        <span className="">{visitor.name}</span>
        <UIDropdownMenu
          items={MENU_ITEMS}
          toggleButton={
            <div className="p-1 -mt-[1px]">
              <Icon icon="fa6-solid:ellipsis" className="opacity-40" />
            </div>
          }
        />
      </div>
      <div className="w-20 h-20 mx-auto">
        <ConversationsUserAvatar visitor={visitor} />
      </div>
      <div className="grid grid-cols-2 space-x-2">
        <UIInput
          label="Name"
          name="name"
          value={visitorSettings.name}
          onChange={handleVisitorSettingsChange}
        />
        {/*<UIInput*/}
        {/*  label="Email"*/}
        {/*  name="email"*/}
        {/*  placeholder="Visitor email"*/}
        {/*  value={visitorSettings.email || ''}*/}
        {/*  onChange={handleVisitorSettingsChange}*/}
        {/*/>*/}
      </div>
      <UIInput
        label="Bot Summary"
        type="textarea"
        name="summary"
        value={botSettings.summary}
        onChange={handleBotSettingsChange}
      />
      <UIInput
        label="Notes"
        type="textarea"
        name="notes"
        value={botSettings.notes}
        onChange={handleBotSettingsChange}
      />
      <div>
        <div className="flex items-center justify-between mb-4">
          <span>Contact Tags</span>
          <div
            className="flex items-center space-x-2 text-purple-600 cursor-pointer"
            onClick={handleAddTag}
          >
            <Icon icon="fa6-solid:plus" />
            <span>Add Tag</span>
          </div>
        </div>
        <div className="flex flex-wrap space-x-1">
          {tags.map((el) => (
            <OpacityBox className="rounded-md pl-2 pr-1 py-1 flex items-center space-x-1" key={el}>
              <span>{el}</span>
              <span className="p-1 cursor-pointer" onClick={() => handleTagRemoval(el)}>
                <Icon className="opacity-60" icon="fa6-solid:xmark" />
              </span>
            </OpacityBox>
          ))}
        </div>
      </div>
    </>
  );
};
