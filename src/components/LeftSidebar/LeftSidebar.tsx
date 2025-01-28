import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';
import { StakedInfo } from 'src/components/LeftSidebar/StakedInfo';

type NavItem = {
  name: string;
  to?: string;
  href?: string;
  icon: string;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Conversations',
    // to: '/conversations',
    icon: 'fa6-solid:comments',
    disabled: true,
  },
  {
    name: 'Dashboard',
    // to: '/dashboard',
    icon: 'fa6-solid:gauge-high',
    disabled: true,
  },
  {
    name: 'Archi AI Agent',
    // to: '/my-bots',
    icon: 'fa6-solid:robot',
    disabled: true,
  },
  {
    name: 'Product Suite',
    // to: '/product-suite',
    icon: 'fa6-solid:file-invoice-dollar',
    disabled: true,
  },
  {
    name: 'Staking',
    to: '/staking',
    icon: 'fa6-solid:layer-group',
  },
  {
    name: 'Affiliate Program',
    // to: '/affiliate-program',
    icon: 'fa6-solid:link',
    disabled: true,
  },
  
];

const NavElement = ({ item }: { item: NavItem }) => {
  const commonContent = (
    <>
      <div className="w-[18px] h-[18px] -mt-[2px] mr-2 flex items-center justify-center">
        <Icon icon={item.icon} />
      </div>
      <span className="mr-6">{item.name}</span>
      {item.disabled ? (
        <span className="text-xs ml-auto px-2 py-0.5 rounded-xl text-black bg-white">soon</span>
      ) : (
        <Icon className="ml-auto w-5" icon="fa6-solid:angle-right" />
      )}
    </>
  );

  if (item.to) {
    return (
      <NavLink
        key={item.to}
        to={item.disabled ? '#' : item.to}
        className={({ isActive }) =>
          `px-6 py-3 flex items-center cursor-pointer ${
            item.disabled || !isActive ? 'opacity-40' : ''
          }`
        }
      >
        {commonContent}
      </NavLink>
    );
  }

  return (
    <a
      key={item.href}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-6 py-3 flex items-center cursor-pointer ${item.disabled ? 'opacity-40' : ''}`}
    >
      {commonContent}
    </a>
  );
};

export const LeftSidebar = () => {
  return (
    <div className="flex flex-col">
      {NAV_ITEMS.map((item) => (
        <NavElement key={item.to || item.href} item={item} />
      ))}
      <StakedInfo />
    </div>
  );
};
