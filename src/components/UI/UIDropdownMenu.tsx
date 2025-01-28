import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useImmutableCallback } from 'src/hooks/useActualRef';
import { useAppChain } from 'src/providers/AppChainProvider';

type Props = {
  withWrongNetwork?: boolean;
  toggleButton: ReactNode | string;
  items: {
    name: ReactNode | string;
    disabled?: boolean;
    onClick: () => void;
  }[];
  onToggle?: (state: boolean) => void;
};

export const UIDropdownMenu: FC<Props> = ({
  toggleButton,
  items,
  withWrongNetwork,
  onToggle = () => {},
}) => {
  const [{ chainConfig }] = useAppChain();
  const { chainId, isConnected } = useWeb3ModalAccount();

  const [isOpen, setIsOpen] = useState(false);

  const wrongNetwork = isConnected && chainId !== chainConfig.id;

  useEffect(() => {
    document.addEventListener('click', closeMenuHandler);

    return () => {
      document.removeEventListener('click', closeMenuHandler);
    };
  }, []);

  const closeMenuHandler = useImmutableCallback(() => {
    onToggle(false);
    setIsOpen(false);
  });

  return (
    <div
      className="cursor-pointer relative"
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      {toggleButton}
      <div
        className="origin-top-right absolute right-0 top-full mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {withWrongNetwork && wrongNetwork && (
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-white bg-opacity-40 backdrop-blur-sm text-gray-700 rounded-md">
            Wrong network
          </div>
        )}
        {isOpen && (
          <div className="py-1" role="none">
            {items.map((item) => (
              <div
                className="text-gray-700 block px-4 py-2 text-sm cursor-pointer whitespace-nowrap hover:bg-gray-200"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-0"
                onClick={item.onClick}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
