import { Modal } from 'src/components/UI/Modal';
import { UIButton } from 'src/components/UI/UIButton';

import { useSetModal } from 'src/providers/ModalsProvider';

const STEPS = [
  <p>
    Add{' '}
    <a
      className="font-semibold cursor-pointer underline inline text-[#FB1FFF]"
      href="https://t.me/AIgentXBot"
      target="_blank"
      rel="noreferrer"
    >
      @AIgentXBot
    </a>{' '}
    to your group
  </p>,
  <p>Set the Bot as an admin of the group</p>,
  <p>
    Execute <span className="font-semibold">/setup_group</span> command inside of the group
  </p>,
  <p>Click "Done" to finish the setup</p>,
];

export const SetUpTelegramIntegrationModal = () => {
  const setModal = useSetModal();

  return (
    <Modal size="lg">
      <div className="modal-title">To setup the bot to telegram</div>
      <div className="max-w-md mx-auto p-6 bg-black bg-opacity-5 rounded-2xl">
        <ul className="list-decimal list-inside">
          {STEPS.map((step, i) => (
            <li className="relative step flex items-start [&:not(:last-child)]:pb-4 after:bottom-0 after:h-full">
              <div className="relative z-10 w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 mr-3">
                <span className="-ml-[1px]">{i + 1}</span>
              </div>
              <div className="mt-[2px]">{step}</div>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-center mt-6">
        Watch{' '}
        <a
          className="font-semibold cursor-pointer underline inline text-[#FB1FFF]"
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
        >
          video
        </a>{' '}
        with detailed instructions.
      </p>
      <UIButton className="mt-8 w-full" onClick={() => setModal(null)}>
        Done
      </UIButton>
    </Modal>
  );
};
