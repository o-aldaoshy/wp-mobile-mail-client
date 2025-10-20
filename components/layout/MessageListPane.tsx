import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { MessageRow } from '../MessageRow';
import { Message, SortKey, MessageCategory } from '../../types';
import { IconButton } from '../ui/IconButton';
import { MenuIcon, EllipsisVerticalIcon, XMarkIcon, SearchIcon } from '../icons';
import { DropdownMenu, DropdownMenuItem } from '../ui/Dropdown';
import { BottomActionBar } from './BottomActionBar';
import { Chip } from '../ui/Chip';

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

  messages.forEach(message => {
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
    selectAllMessages, clearSelection, setIsSearchOpen,
    activeFilters, setIsFilterModalOpen,
    sortOrder, setSortOrder
  } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchQuery = ''; // Search is handled by the modal now
  const currentAccount = accounts[0];

  const categories: MessageCategory[] = ['Primary', 'Social', 'Promotions', 'Updates', 'Forums'];
  const [activeCategory, setActiveCategory] = useState<MessageCategory>('Primary');

  const handleSortChange = (key: SortKey) => {
    if (sortOrder.key === key) {
        setSortOrder({ key, direction: sortOrder.direction === 'asc' ? 'desc' : 'asc' });
    } else {
        const defaultDirection = (key === 'date') ? 'desc' : 'asc';
        setSortOrder({ key, direction: defaultDirection });
    }
    setIsMenuOpen(false);
  };

  const categoryUnreadCounts = useMemo(() => {
    const counts: Record<MessageCategory, number> = { Primary: 0, Promotions: 0, Social: 0, Updates: 0, Forums: 0 };
    if (selectedFolder?.id !== 'inbox') return counts;

    messages.filter(m => m.folder === 'inbox' || m.folder === 'in_design').forEach(m => {
        if (!m.isRead) {
            const category = m.category || 'Primary';
            if (counts[category] !== undefined) {
                counts[category]++;
            }
        }
    });
    return counts;
  }, [messages, selectedFolder]);

  const filteredMessages = useMemo(() => {
      if (!selectedFolder) return [];
      
      let folderMessages = messages.filter(m => m.folder === selectedFolder.id || (selectedFolder.id === 'inbox' && m.folder === 'in_design'));
      
      if (selectedFolder.id === 'inbox') {
        folderMessages = folderMessages.filter(m => {
            const category = m.category || 'Primary';
            return category === activeCategory;
        });
      }

      const isAnyFilterActive = Object.values(activeFilters).some(v => v);
  
      if (!isAnyFilterActive) {
          return folderMessages;
      }
  
      return folderMessages.filter(message => {
          // General filters (all must be true)
          if (activeFilters.unread && message.isRead) return false;
          if (activeFilters.starred && !message.isFlagged) return false;
          if (activeFilters.attachments && message.attachments.length === 0) return false;
          if (activeFilters.unanswered && message.isAnswered) return false;
          if (activeFilters.favorites && !message.isFavorite) return false;
  
          // Label filters (at least one must be true, if any label filters are active)
          const activeLabelFilters = (['personal', 'social', 'updates', 'forums'] as const)
              .filter(label => activeFilters[label]);
  
          if (activeLabelFilters.length > 0) {
              const messageLabels = message.labels?.map(l => l.toLowerCase()) || [];
              if (!activeLabelFilters.some(filterLabel => messageLabels.includes(filterLabel))) {
                  return false;
              }
          }
  
          return true;
      });
  }, [messages, selectedFolder, activeFilters, activeCategory]);

  const sortedMessages = useMemo(() => {
    return [...filteredMessages].sort((a, b) => {
      const { key, direction } = sortOrder;
      const dir = direction === 'asc' ? 1 : -1;

      switch (key) {
        case 'sender':
          return a.sender.name.localeCompare(b.sender.name) * dir;
        case 'subject':
          return a.subject.localeCompare(b.subject) * dir;
        case 'unread':
          const unreadComparison = (a.isRead ? 1 : 0) - (b.isRead ? 1 : 0);
          if (unreadComparison !== 0) {
            // For unread, 'asc' means unread first, which matches the comparison.
            return unreadComparison * (direction === 'asc' ? 1 : -1);
          }
          // Fallback to date sort if same read status
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'date':
        default:
          return (a.timestamp.getTime() - b.timestamp.getTime()) * dir;
      }
    });
  }, [filteredMessages, sortOrder]);
    
  const displayMessages = useMemo(() => {
    const result: Message[] = [];
    const processedThreadIds = new Set<string>();
    const sortedFolderMessages = sortedMessages;

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
  }, [sortedMessages]);


  const unreadTodayCount = useMemo(() => {
    const today = new Date();
    return filteredMessages.filter(m => 
      !m.isRead && 
      m.timestamp.toDateString() === today.toDateString()
    ).length;
  }, [filteredMessages]);

  const groupedMessages = useMemo(() => {
    const messagesToProcess = isSelectionMode ? sortedMessages : displayMessages;
    // Don't group by date if sorting is not default.
    if (sortOrder.key !== 'date') {
        return { 'Results': messagesToProcess };
    }
    return groupMessagesByDate(messagesToProcess);
  }, [isSelectionMode, sortedMessages, displayMessages, sortOrder.key]);
  
  const handleSelectAll = () => {
    const allIds = filteredMessages.map(m => m.id);
    selectAllMessages(allIds);
  };
  
  const handleExitSelectionMode = () => {
    clearSelection();
    setIsSelectionMode(false);
  };

  const renderOrder = sortOrder.key === 'date' ? groupOrder : Object.keys(groupedMessages);

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
                    renderOrder.map(groupKey => {
                        if (!groupedMessages[groupKey] || groupedMessages[groupKey].length === 0) return null;
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
                    <DropdownMenuItem onClick={() => { setIsMenuOpen(false); setIsFilterModalOpen(true); }}>
                        Filter by
                    </DropdownMenuItem>
                    <div className="my-1 border-t border-outline mx-2"></div>
                    <div className="px-4 pt-2 pb-1 text-xs font-semibold text-on-surface-variant">SORT BY</div>
                    <DropdownMenuItem onClick={() => handleSortChange('date')}>Date {sortOrder.key === 'date' && (sortOrder.direction === 'desc' ? '▾' : '▴')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('sender')}>Sender {sortOrder.key === 'sender' && (sortOrder.direction === 'desc' ? '▾' : '▴')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('subject')}>Subject {sortOrder.key === 'subject' && (sortOrder.direction === 'desc' ? '▾' : '▴')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('unread')}>Unread {sortOrder.key === 'unread' && (sortOrder.direction === 'desc' ? '▾' : '▴')}</DropdownMenuItem>
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
        
        {selectedFolder?.id === 'inbox' && (
            <div className="px-4 pb-2 shrink-0">
                <div className="flex space-x-2 overflow-x-auto pb-1 -mx-2 px-2">
                    {categories.map(category => {
                        const unreadCount = categoryUnreadCounts[category];
                        return (
                            <Chip
                                key={category}
                                isActive={activeCategory === category}
                                onClick={() => setActiveCategory(category)}
                                label={
                                    <div className="flex items-center space-x-2">
                                        <span>{category}</span>
                                        {unreadCount > 0 && (
                                            <span className="bg-accent text-white text-xs font-bold px-1.5 h-5 flex items-center justify-center rounded-full min-w-[20px]">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                }
                            />
                        );
                    })}
                </div>
            </div>
        )}

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
          renderOrder.map(groupKey => {
            if (!groupedMessages[groupKey] || groupedMessages[groupKey].length === 0) return null;
            return (
              <div key={groupKey} className="mb-2">
                 {groupKey !== 'Results' && (
                    <div className="px-4 py-2 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-on-surface-variant">{groupKey}</h3>
                        {groupKey === 'Today' && <p className="text-xs text-on-surface-variant">Last synced 15:33</p>}
                    </div>
                 )}
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