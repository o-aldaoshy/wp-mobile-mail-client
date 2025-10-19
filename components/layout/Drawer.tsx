// FIX: Import useState from React to resolve 'Cannot find name' error.
import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Folder } from '../../types';
import { IconButton } from '../ui/IconButton';
// FIX: Import SparklesIcon to resolve 'Cannot find name' error.
import { 
    Cog6ToothIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon, 
    QuestionMarkCircleIcon, InformationCircleIcon, HeartIcon,
    CheckSquareIcon, ChevronRightIcon, SparklesIcon
} from '../icons';

const mainFolderIds = ['inbox', 'unread', 'flagged', 'vips'];

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FolderItem: React.FC<{folder: Folder, isSelected: boolean, onSelect: (folder: Folder) => void}> = ({ folder, isSelected, onSelect }) => {
    const itemClasses = `flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors cursor-pointer`;
    const selectedClasses = `bg-primary-container text-on-surface font-semibold`;
    const unselectedClasses = `text-on-surface-variant hover:bg-primary-container/50`;
    const vipClasses = folder.isVip ? 'text-vip' : '';

    return (
        <li>
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); onSelect(folder); }}
                className={`${itemClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
            >
                <div className={`flex items-center font-medium ${vipClasses}`}>
                    {folder.isVip ? 
                        <span className="w-5 text-center mr-4 text-xs font-bold">VIP</span> 
                        : <folder.icon className="h-5 w-5 mr-4" />}
                    <span>{folder.name}</span>
                </div>
                {folder.unreadCount && folder.unreadCount > 0 ? (
                    <span className="text-xs font-semibold bg-accent text-white rounded-full px-1.5 h-5 flex items-center justify-center min-w-[20px]">
                      {folder.unreadCount}
                    </span>
                  ) : null}
            </a>
        </li>
    );
}

const MoreItem: React.FC<{
  icon: React.ElementType,
  title: string,
  value?: string,
  onClick: () => void,
}> = ({ icon: Icon, title, value, onClick }) => (
    <li>
      <a href="#" onClick={(e) => {e.preventDefault(); onClick();}} className="flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg text-sm text-on-surface-variant hover:bg-primary-container/50">
        <div className="flex items-center font-medium">
          <Icon className="h-5 w-5 mr-4" />
          <span>{title}</span>
        </div>
        {value && <span className="text-xs font-semibold text-on-surface-variant">{value}</span>}
      </a>
    </li>
);

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { 
      folders, selectedFolder, setSelectedFolder, accounts, 
      setIsSettingsOpen, setInitialSettingsView
  } = useContext(AppContext);

  const [isAllFoldersOpen, setAllFoldersOpen] = useState(false);
  const currentAccount = accounts[0];

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
    onClose();
  };
  
  const handleOpenSettings = (view: string) => {
    setInitialSettingsView(view);
    setIsSettingsOpen(true);
    onClose();
  };

  const drawerClasses = `fixed lg:relative inset-y-0 left-0 bg-surface w-80 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`;

  return (
    <>
      <div className={drawerClasses}>
        {/* Drawer Header */}
        <div className="relative flex h-24 items-center justify-between px-4">
          <div className="flex items-center">
            {currentAccount.providerIcon && (
              <currentAccount.providerIcon className="h-10 w-10" />
            )}
            <div className="ml-3">
              <p className="font-semibold text-on-surface">{currentAccount.name}</p>
              <p className="text-sm text-on-surface-variant">{currentAccount.email}</p>
            </div>
          </div>
          <IconButton label="Settings" onClick={() => handleOpenSettings('main')}>
            <Cog6ToothIcon className="h-6 w-6 text-on-surface-variant" />
          </IconButton>
        </div>

        <nav className="flex-grow overflow-y-auto px-2 pb-4">
          <ul className="space-y-1">
            {folders.filter(f => mainFolderIds.includes(f.id)).map(folder => (
              <FolderItem 
                key={folder.id} 
                folder={folder} 
                isSelected={selectedFolder?.id === folder.id}
                onSelect={handleFolderSelect}
              />
            ))}
          </ul>
          
          <hr className="my-3 border-outline" />
          
          <h3 className="px-4 py-1 text-sm font-semibold text-on-surface">Favorites</h3>
          <ul>
            <li>
              <a href="#" className="flex items-center px-4 py-2.5 mx-2 rounded-lg text-sm text-on-surface-variant hover:bg-primary-container/50">
                <PlusIcon className="h-5 w-5 mr-4" />
                <span className="font-medium">Add</span>
              </a>
            </li>
          </ul>

          <hr className="my-3 border-outline" />

          <h3 className="px-4 py-1 text-sm font-semibold text-on-surface">More</h3>
           <ul className="space-y-1">
                <MoreItem icon={Cog6ToothIcon} title="Preferences" onClick={() => handleOpenSettings('main')} />
                <MoreItem icon={SparklesIcon} title="Get Pro" onClick={() => alert('Get Pro clicked')} />
                <MoreItem icon={HeartIcon} title="Love Canary?" onClick={() => alert('Love Canary? clicked')} />
                <MoreItem icon={QuestionMarkCircleIcon} title="Help" onClick={() => handleOpenSettings('contactUs')} />
                <MoreItem icon={InformationCircleIcon} title="Privacy Policy" onClick={() => alert('Privacy Policy clicked')} />
                <MoreItem icon={CheckSquareIcon} title="App Progress" value="33%" onClick={() => handleOpenSettings('appProgress')} />
            </ul>

          <div className="mt-4">
            <div 
              className="flex items-center justify-between px-4 py-2 cursor-pointer"
              onClick={() => setAllFoldersOpen(!isAllFoldersOpen)}
            >
              <h3 className="text-sm font-semibold text-on-surface">All folders</h3>
              {isAllFoldersOpen ? <ChevronUpIcon className="h-4 w-4 text-on-surface-variant" /> : <ChevronDownIcon className="h-4 w-4 text-on-surface-variant" />}
            </div>

            {isAllFoldersOpen && (
              <ul className="space-y-1 mt-2">
                  {folders.map(folder => (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      isSelected={selectedFolder?.id === folder.id}
                      onSelect={handleFolderSelect}
                    />
                  ))}
              </ul>
            )}
          </div>
        </nav>
        
        <div className="p-2 shrink-0">
          <a href="#" className="flex items-center justify-between bg-blue-600 text-white w-full px-4 py-3 rounded-lg">
            <span className="font-semibold">Pro Trial: 6 days left</span>
            <ChevronRightIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/30 z-30 lg:hidden"></div>}
    </>
  );
};