import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { UIDropdown } from 'src/components/UI/UIDropdown';
import { UIInput } from 'src/components/UI/UIInput';
import { UITooltip } from 'src/components/UI/UITooltip';
import { BotSettingsType } from 'src/types/bots';

const autoReply = [
  { name: 'Active', value: 'true' },
  { name: 'Inactive', value: 'false' },
];

const toneOfVoiceOptions = [
  { name: '👔 💼 Formal', value: 'formal' },
  { name: '😊 🤝 Friendly', value: 'friendly' },
  { name: '🚀 🌑 Enthusiastic', value: 'enthusiastic' },
  { name: '🧠 🖥 Technical', value: 'technical' },
  { name: '😜 🎈 Humorous', value: 'humorous' },
];

export const BotSettings: FC<{
  settings: BotSettingsType;
  setSettings:
    | Dispatch<SetStateAction<BotSettingsType>>
    | Dispatch<SetStateAction<BotSettingsType | null>>;
}> = ({ settings, setSettings }) => {
  const [demoInfo, setDemoInfo] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;

    setSettings({
      ...settings,
      [name]: event.target.type === 'checkbox' ? checked : value,
    });
  };

  const handleSwitchChange = (name: string) => (value: boolean) => {
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleDropdownSelect =
    (name: keyof BotSettingsType) => (option: { value: string; name: string }) => {
      setSettings({
        ...settings,
        [name]: option.value,
      });
    };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col space-y-6">
        {/*<UIInput*/}
        {/*  type="textarea"*/}
        {/*  label="Bot Name"*/}
        {/*  name="name"*/}
        {/*  value={settings.name}*/}
        {/*  placeholder="Bot Name"*/}
        {/*  onChange={handleInputChange}*/}
        {/*/>*/}
        <UIInput
          type="textarea"
          label="Company Information"
          name="company_info"
          value={settings.company_info}
          placeholder="Company Information"
          labelEnd={
            <UITooltip message="Brief important information about your project, which may include a description, mission, vision and the like." />
          }
          onChange={handleInputChange}
        />
        <UIInput
          type="textarea"
          label="CoinGecko"
          name="coingecko"
          value={settings.coingecko}
          placeholder="CoinGecko"
          labelEnd={
            <UITooltip message="Provide a link to your token's CoinGecko page, allowing bot to have a real-time information about a token." />
          }
          onChange={handleInputChange}
        />
        <UIInput
          type="textarea"
          label="DEX Tools"
          name="dex_tools_link"
          value={settings.dex_tools_link}
          placeholder="DEX Tools"
          labelEnd={
            <UITooltip message="Provide a link to your token's DEXTools page, allowing bot to have a real-time information about a token." />
          }
          onChange={handleInputChange}
        />
        <UIInput
          type="textarea"
          label="DEX Screener"
          name="dex_screener"
          value={demoInfo}
          placeholder="DEX Screener"
          labelEnd={
            <UITooltip message="Provide a link to your token's DEX Screener page, allowing bot to have a real-time information about a token." />
          }
          onChange={(e) => setDemoInfo(e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-6">
        <UIInput
          type="textarea"
          label="How To Buy"
          name="how_to_buy"
          value={settings.how_to_buy}
          placeholder="How To Buy"
          labelEnd={
            <UITooltip message="Provide names of the decentralized and centralized exchanges where users can buy your token." />
          }
          onChange={handleInputChange}
        />
        <UIInput
          type="textarea"
          label="Smart Contracts"
          name="contracts"
          value={settings.contracts}
          placeholder="Smart Contracts"
          labelEnd={
            <UITooltip message="Share the smart-contract addresses including short description for each for transparency." />
          }
          onChange={handleInputChange}
        />
        <UIDropdown
          label="Auto response"
          options={autoReply}
          value={autoReply.find((el) => el.value === settings.autoreply)}
          labelEnd={
            <UITooltip message="The bot will provide automatic responses in the chat, even if it is not tagged." />
          }
          onSelect={handleDropdownSelect('autoreply')}
        />
        <UIDropdown
          label="Tone of Voice"
          options={toneOfVoiceOptions}
          value={toneOfVoiceOptions.find((el) => el.value === settings.ton_of_voice)}
          labelEnd={
            <UITooltip message="Choose your brand's tone of voice, whether it's friendly, professional, or any other relevant characteristics." />
          }
          onSelect={handleDropdownSelect('ton_of_voice')}
        />
        <UIInput
          type="textarea"
          label="Tokenomics"
          name="token_info"
          value={settings.token_info}
          placeholder="Token utility and tokenomics"
          labelEnd={
            <UITooltip message="Include essential information about your token utilities and basic token details such as: token symbol, token name, total supply, circulation supply, max supply, network, tokens allocation distribution and other smaller details" />
          }
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};
