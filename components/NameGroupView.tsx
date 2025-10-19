import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { IconButton } from './ui/IconButton';
import { ArrowLeftIcon, CameraIcon, ClockSlashIcon, UsersIcon } from './icons';
import { GroupChat } from '../types';

export const NameGroupView: React.FC = () => {
  const { setCurrentView, setGroupChatInfo, setGroupChats } = useContext(AppContext);
  const [groupName, setGroupName] = useState('');

  const handleCreate = () => {
    if (groupName.trim()) {
      const newGroup: GroupChat = {
        id: `gc_${Date.now()}`,
        name: groupName.trim(),
        lastMessage: 'You created the group.',
        timestamp: new Date(),
        avatarColor: 'bg-green-200 dark:bg-green-800', // A default color for new groups
        readReceiptStatus: 'sent',
        lastMessageIcon: UsersIcon,
        messages: [{ text: 'You created the group.', sender: 'system' }],
      };
      setGroupChats(prev => [newGroup, ...prev]);
      setGroupChatInfo({ id: newGroup.id, name: newGroup.name });
      setCurrentView('groupChat');
    }
  };

  return (
    <div className="bg-bg text-on-surface h-full flex flex-col">
      <header className="flex items-center p-4 shrink-0">
        <IconButton label="Back" onClick={() => setCurrentView('groupSelectMembers')} className="-ml-2">
          <ArrowLeftIcon className="h-6 w-6" />
        </IconButton>
        <h1 className="text-xl font-bold ml-4">Name this group</h1>
      </header>

      <main className="flex-grow overflow-y-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-8">
          <button className="h-16 w-16 rounded-full bg-surface flex items-center justify-center">
            <CameraIcon className="h-8 w-8 text-on-surface-variant" />
          </button>
          <input
            type="text"
            placeholder="Group name (required)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="flex-grow bg-transparent text-xl text-on-surface placeholder-on-surface-variant border-b-2 border-outline focus:border-primary focus:outline-none"
          />
        </div>

        <button className="flex items-center w-full text-left py-4">
          <ClockSlashIcon className="h-6 w-6 text-on-surface-variant mr-4" />
          <div className="flex-grow">
            <p className="font-medium text-on-surface">Disappearing messages</p>
          </div>
          <span className="text-on-surface-variant">Off</span>
        </button>

        <div className="mt-8">
            <h2 className="text-on-surface-variant font-semibold mb-2">Members</h2>
            <p className="text-on-surface-variant">You can add or invite friends after creating this group.</p>
        </div>
      </main>

      <footer className="p-4 shrink-0">
        <button
          onClick={handleCreate}
          disabled={!groupName.trim()}
          className="w-full py-3 rounded-full font-semibold text-lg transition-colors disabled:bg-gray-700 disabled:text-gray-400 bg-primary-container text-primary"
        >
          Create
        </button>
      </footer>
    </div>
  );
};