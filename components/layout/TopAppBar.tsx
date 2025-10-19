import React, { useContext } from 'react';
import { MenuIcon, SearchIcon, EllipsisVerticalIcon } from '../icons';
import { IconButton } from '../ui/IconButton';
import { AppContext } from '../../context/AppContext';

interface TopAppBarProps {
  onMenuClick: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ onMenuClick }) => {
  const { selectedFolder, accounts } = useContext(AppContext);
  const currentAccount = accounts[0];

  return (
    <header className="bg-surface h-20 flex items-center px-4 shrink-0 z-10 border-b border-outline">
      <IconButton onClick={onMenuClick} label="Open navigation menu">
        <MenuIcon className="h-6 w-6 text-on-surface" />
      </IconButton>
      <div className="ml-4">
        <h1 className="text-2xl font-bold text-on-surface">
          {selectedFolder?.name || 'Mail'}
        </h1>
        <p className="text-sm text-on-surface-variant">{currentAccount.email}</p>
      </div>
      <div className="flex-grow" />
      <IconButton label="Search mail">
        <SearchIcon className="h-6 w-6 text-on-surface" />
      </IconButton>
      <IconButton label="More options">
        <EllipsisVerticalIcon className="h-6 w-6 text-on-surface" />
      </IconButton>
    </header>
  );
};