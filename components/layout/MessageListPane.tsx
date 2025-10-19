import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { MessageRow } from '../MessageRow';
import { Message } from '../../types';
import { IconButton } from '../ui/IconButton';
import { MenuIcon, EllipsisVerticalIcon, XMarkIcon, SearchIcon } from '../icons';
import { DropdownMenu, DropdownMenuItem } from '../ui/Dropdown';
import { BottomActionBar } from './BottomActionBar';

interface MessageListPaneProps {
  className?: string;
  onMenuClick: () => void;
}

const groupMessagesByDate = (messages: Message[]) => {
  const groups: { [key: string]: Message[] } = {};
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const getGroupKey = (date: Date): string => {
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    const diffDays = Math.ceil((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return 'Last week';
    
    return 'Older';
  };

  const sortedMessages = [...messages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  sortedMessages.forEach(message => {
    const key = getGroupKey(message.timestamp);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(message);
  });

  return groups;
};

const groupOrder = ['Today', 'Yesterday', 'Last week', 'Older'];

const SelectionHeader: React.FC<{
    onClose: () => void;
    selectedCount: number;
    email: string;
}> = ({ onClose, selectedCount, email }) => {
    return (
        <header className="flex items-center px-4 py-3 shrink-0 bg-surface border-b border-outline">
            <IconButton onClick={onClose} label="Cancel selection" className="-ml-2">
                <XMarkIcon className="h-6 w-6 text-on-surface" />
            </IconButton>
            <div className="ml-4">
                <h1 className="text-xl font-bold text-on-surface">
                    {selectedCount} selected
                </h1>
                <p className="text-sm text-on-surface-variant">{email}</p>
            </div>
        </header>
    );
};


export const MessageListPane: React.FC<MessageListPaneProps> = ({ className, onMenuClick }) => {
  const { 
    messages, selectedFolder, selectedMessage, setSelectedMessage, accounts,
    isSelectionMode, setIsSelectionMode, selectedMessageIds, toggleMessageSelection,
    selectAllMessages, clearSelection, setIsSearchOpen
  } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchQuery = ''; // Search is handled by the modal now
  const currentAccount = accounts[0];

  const filteredMessages = useMemo(() => {
      if (!selectedFolder) return [];
      return messages.filter(m => m.folder === selectedFolder.id || (selectedFolder.id === 'inbox' && m.folder === 'in_design'));
  }, [messages, selectedFolder]);
    
  const displayMessages = useMemo(() => {
    const result: Message[] = [];
    const processedThreadIds = new Set<string>();
    const sortedFolderMessages = [...filteredMessages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    for (const message of sortedFolderMessages) {
      if (message.threadId && !processedThreadIds.has(message.threadId)) {
        const threadMessages = sortedFolderMessages.filter(m => m.threadId === message.threadId);
        const rootMessage = threadMessages.find(m => m.isThread) || threadMessages[0];
        result.push(rootMessage);
        processedThreadIds.add(message.threadId);
      } else if (!message.threadId) {
        result.push(message);
      }
    }
    return result;
  }, [filteredMessages]);


  const unreadTodayCount = useMemo(() => {
    const today = new Date();
    return filteredMessages.filter(m => 
      !m.isRead && 
      m.timestamp.toDateString() === today.toDateString()
    ).length;
  }, [filteredMessages]);

  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(isSelectionMode ? filteredMessages : displayMessages);
  }, [isSelectionMode, filteredMessages, displayMessages]);
  
  const handleSelectAll = () => {
    const allIds = filteredMessages.map(m => m.id);
    selectAllMessages(allIds);
  };
  
  const handleExitSelectionMode = () => {
    clearSelection();
    setIsSelectionMode(false);
  };

  if (isSelectionMode) {
    return (
        <div className={`bg-bg flex flex-col h-full ${className}`}>
            <SelectionHeader
                onClose={handleExitSelectionMode}
                selectedCount={selectedMessageIds.size}
                email={currentAccount.email}
            />
            <div className="flex items-center px-4 py-3 border-b border-outline bg-surface shrink-0">
                <input
                    type="checkbox"
                    className="h-5 w-5 rounded text-accent focus:ring-accent border-gray-400"
                    checked={filteredMessages.length > 0 && selectedMessageIds.size === filteredMessages.length}
                    onChange={handleSelectAll}
                    aria-label="Select all messages"
                />
                <label className="ml-4 text-on-surface font-medium">All</label>
            </div>
            
            <div className="flex-grow overflow-y-auto px-2">
                {Object.keys(groupedMessages).length > 0 ? (
                    groupOrder.map(groupKey => {
                        if (!groupedMessages[groupKey]) return null;
                        return (
                        <div key={groupKey} className="mb-2">
                            <div className="px-4 py-2 flex justify-between items-center">
                              <h3 className="text-sm font-semibold text-on-surface-variant">{groupKey}</h3>
                            </div>
                            <div className="space-y-2">
                            {groupedMessages[groupKey].map(message => (
                                <MessageRow 
                                  key={message.id}
                                  message={message}
                                  isSelected={selectedMessageIds.has(message.id)}
                                  isSelectionMode={true}
                                  onToggleSelection={toggleMessageSelection}
                                  onSelect={() => undefined}
                                />
                            ))}
                            </div>
                        </div>
                        )
                    })
                ) : (
                    <div className="text-center p-10 text-on-surface-variant">
                        <p>No messages here.</p>
                    </div>
                )}
            </div>
            <BottomActionBar selectedIds={Array.from(selectedMessageIds)} />
        </div>
    );
  }

  return (
    <div className={`bg-bg flex flex-col ${className}`}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
            <div className="flex items-center">
                <IconButton onClick={onMenuClick} label="Open navigation menu" className="-ml-2">
                    <MenuIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
                <div className="ml-4">
                    <h1 className="text-2xl font-bold text-on-surface">
                        {selectedFolder?.name || 'Mail'}
                    </h1>
                    <p className="text-sm text-on-surface-variant">{currentAccount.email}</p>
                </div>
            </div>
            <div className="relative">
                <IconButton label="More options" onClick={() => setIsMenuOpen(o => !o)}>
                    <EllipsisVerticalIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
                <DropdownMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                    <DropdownMenuItem onClick={() => { setIsMenuOpen(false); setIsSelectionMode(true); }}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setIsMenuOpen(false); }}>
                        Sort by
                    </DropdownMenuItem>
                </DropdownMenu>
            </div>
        </div>
      
        <div className="px-4 pb-2 shrink-0">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-on-surface-variant" />
                </div>
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="block w-full bg-surface-alt border border-transparent rounded-full py-2 pl-10 pr-3 text-left text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                    aria-label="Search mail"
                >
                    Search
                </button>
            </div>
        </div>

      <div className="flex-grow overflow-y-auto px-2">
        {unreadTodayCount > 0 && selectedFolder?.id === 'inbox' && !searchQuery && (
            <div className="px-4 py-8">
                <h2 className="text-4xl font-bold text-on-surface leading-tight">
                    {unreadTodayCount} unread email{unreadTodayCount > 1 ? 's' : ''} today
                </h2>
                <button className="mt-4 bg-primary-container text-on-surface font-semibold px-6 py-2 rounded-full text-sm">
                    View
                </button>
            </div>
        )}

        {Object.keys(groupedMessages).length > 0 ? (
          groupOrder.map(groupKey => {
            if (!groupedMessages[groupKey]) return null;
            return (
              <div key={groupKey} className="mb-2">
                <div className="px-4 py-2 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-on-surface-variant">{groupKey}</h3>
                  {groupKey === 'Today' && <p className="text-xs text-on-surface-variant">Last synced 15:33</p>}
                </div>
                <div className="space-y-2">
                  {groupedMessages[groupKey].map(message => (
                    <MessageRow 
                      key={message.id}
                      message={message}
                      isSelected={selectedMessage?.id === message.id}
                      onSelect={setSelectedMessage}
                      isSelectionMode={false}
                      onToggleSelection={() => {}}
                    />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
            <div className="text-center p-10 text-on-surface-variant">
                <p>{searchQuery ? 'No results found.' : 'No messages here.'}</p>
            </div>
        )}
      </div>
    </div>
  );
};