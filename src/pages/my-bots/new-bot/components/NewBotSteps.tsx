import { FC } from 'react';

const STEPS = [
  { label: 'Bot settings', value: '1' },
  { label: 'Knowledge Base Management', value: '2' },
  { label: 'Integrations', value: '3' },
];

export const NewBotSteps: FC<{ currentTab: string }> = ({ currentTab }) => {
  return (
    <div className="flex space-x-4 mb-8">
      {STEPS.map((step) => (
        <button
          key={step.value}
          className={`flex-1 border-b-2 border-b-white text-center pb-2 ${
            currentTab === step.value ? 'opacity-100' : 'opacity-30'
          }`}
          aria-current={currentTab === step.value ? 'step' : undefined}
        >
          {step.label}
        </button>
      ))}
    </div>
  );
};
