import React, { useState, useContext, useEffect } from 'react';
import { Drawer } from './components/layout/Drawer';
import { MessageListPane } from './components/layout/MessageListPane';
import { MessageDetailPane } from './components/layout/MessageDetailPane';
import { useResponsiveLayout } from './hooks/useResponsive';
import { AppContext } from './context/AppContext';
import { ComposeView } from './components/ComposeView';
import { ReplyView } from './components/ReplyView';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { MoveModal } from './components/MoveModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AiModal } from './components/AiModal';
import { SettingsModal } from './components/SettingsModal';
import { SearchModal } from './components/SearchModal';
import { SearchIcon, EllipsisVerticalIcon, CameraIcon, EditIcon, UsersIcon, EnvelopeIcon, XMarkIcon } from './components/icons';
import { IconButton } from './components/ui/IconButton';
import { DropdownMenu, DropdownMenuItem } from './components/ui/Dropdown';
import { SelectMembersView } from './components/SelectMembersView';
import { NameGroupView } from './components/NameGroupView';
import { GroupChatView } from './components/GroupChatView';
import { ChatListItem } from './components/ChatListItem';
import { DriveView } from './components/DriveView';

const ChatView: React.FC = () => {
    const { setCurrentView, setGroupChatInfo, groupChats } = useContext(AppContext);
    const [visibleSuggestions, setVisibleSuggestions] = useState(['new_group', 'invite_friends']);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const dismissSuggestion = (id: string) => {
        setVisibleSuggestions(prev => prev.filter(s => s !== id));
    };

    const suggestions = [
        { id: 'new_group', icon: UsersIcon, label: 'New group', color: 'bg-amber-100 dark:bg-zinc-700' },
        { id: 'invite_friends', icon: EnvelopeIcon, label: 'Invite friends', color: 'bg-green-100 dark:bg-zinc-700' },
    ];

    const handleMenuItemClick = (action: string) => {
        if (action === 'New group') {
            setCurrentView('groupSelectMembers');
        } else {
            alert(`${action} clicked`);
        }
        setIsMenuOpen(false);
    };

    const sortedChats = [...groupChats].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return (
    <div className="flex-grow bg-bg text-on-surface flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 shrink-0 border-b border-outline">
            <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                    <span>AM</span>
                </div>
                <h1 className="text-xl font-bold text-on-surface">Signal</h1>
            </div>
            <div className="flex items-center">
                <IconButton label="Search chats">
                    <SearchIcon className="h-6 w-6 text-on-surface-variant" />
                </IconButton>
                <div className="relative">
                    <IconButton label="More options" onClick={() => setIsMenuOpen(o => !o)}>
                        <EllipsisVerticalIcon className="h-6 w-6 text-on-surface-variant" />
                    </IconButton>
                     <DropdownMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                        <DropdownMenuItem onClick={() => handleMenuItemClick('New group')}>New group</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMenuItemClick('Mark all read')}>Mark all read</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMenuItemClick('Invite friends')}>Invite friends</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMenuItemClick('Filter unread chats')}>Filter unread chats</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMenuItemClick('Settings')}>Settings</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMenuItemClick('Notification profile')}>Notification profile</DropdownMenuItem>
                    </DropdownMenu>
                </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto flex flex-col relative">
            <div className="flex-grow">
                {sortedChats.length > 0 ? (
                    <div className="py-2">
                        {sortedChats.map(chat => (
                            <ChatListItem 
                                key={chat.id} 
                                chat={chat} 
                                onClick={() => {
                                    setGroupChatInfo({ id: chat.id, name: chat.name });
                                    setCurrentView('groupChat');
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center text-center p-4 h-full -mt-16">
                        <h2 className="text-xl font-medium text-on-surface">No chats yet.</h2>
                        <p className="text-on-surface-variant mt-1">Get started by messaging a friend.</p>
                    </div>
                )}
            </div>
            
            {/* Get Started Section */}
            <div className="px-4 pb-4 shrink-0">
                <h3 className="text-base font-semibold text-on-surface mb-3">Get started</h3>
                <div className="flex space-x-3 overflow-x-auto pb-2">
                    {suggestions.filter(s => visibleSuggestions.includes(s.id)).map(suggestion => (
                        <div key={suggestion.id} className={`p-3 rounded-2xl flex items-start space-x-2 shrink-0 w-40 ${suggestion.color}`}>
                            <div className="flex-grow">
                                <suggestion.icon className="h-5 w-5 mb-1.5 text-on-surface/80" />
                                <p className="font-medium text-sm text-on-surface">{suggestion.label}</p>
                            </div>
                            <button onClick={() => dismissSuggestion(suggestion.id)} className="p-1 -mr-1 -mt-1 text-on-surface/70" aria-label={`Dismiss ${suggestion.label}`}>
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FABs */}
            <div className="absolute bottom-24 right-4 flex flex-col space-y-3">
                <button className="bg-surface-alt hover:bg-outline/80 rounded-2xl shadow-lg p-4 text-on-surface-variant transition-colors" aria-label="New message with camera">
                    <CameraIcon className="h-6 w-6" />
                </button>
                <button className="bg-primary-container hover:bg-outline rounded-2xl shadow-lg p-4 text-primary transition-colors" aria-label="New message">
                    <EditIcon className="h-6 w-6" />
                </button>
            </div>
        </main>
    </div>
    );
};

const App: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { layout } = useResponsiveLayout();
  const { 
    selectedMessage, 
    isComposing,
    setIsComposing,
    isReplying,
    isSelectionMode,
    confirmationModalConfig,
    setConfirmationModalConfig,
    isSettingsOpen,
    setIsSettingsOpen,
    isSearchOpen,
    setIsSearchOpen,
    theme,
    currentView,
  } = useContext(AppContext);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (isSelectionMode) {
        setDrawerOpen(false);
    }
  }, [isSelectionMode]);

  const handleConfirmModalClose = () => {
    if (confirmationModalConfig?.onCancel) {
      confirmationModalConfig.onCancel();
    }
    setConfirmationModalConfig(null);
  };

  const isDetailPaneVisible = layout === 'two-pane' || layout === 'three-pane';
  
  const showBottomNav = !isSelectionMode && !isComposing && !isReplying && !selectedMessage && !currentView.startsWith('group');


  const renderMainContent = () => {
    switch (currentView) {
        case 'drive':
            return <DriveView />;
        case 'ai':
            return <AiModal />;
        case 'chatList':
            return <ChatView />;
        case 'groupSelectMembers':
            return <SelectMembersView />;
        case 'groupName':
            return <NameGroupView />;
        case 'groupChat':
            return <GroupChatView />;
        case 'mail':
        default:
            return (
                <main className="flex-grow flex flex-row overflow-hidden">
                    {!isSelectionMode && <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />}
                    
                    {layout === 'three-pane' && !isSelectionMode && (
                      <div className="w-64 border-r border-outline hidden lg:block bg-surface-alt">
                         {/* This would be the account/folder rail for 3-pane layout */}
                         <div className="p-4 text-on-surface-variant text-sm">Accounts / Folders</div>
                      </div>
                    )}
            
                    <MessageListPane 
                      onMenuClick={() => setDrawerOpen(!isDrawerOpen)}
                      className={'w-full'} 
                    />
            
                    {isDetailPaneVisible && !isSelectionMode && (
                      <div className="flex-1">
                        <MessageDetailPane message={selectedMessage} />
                      </div>
                    )}
            
                    {!isDetailPaneVisible && selectedMessage && !isSelectionMode && (
                       <div className="absolute inset-0 bg-surface z-20">
                          <MessageDetailPane message={selectedMessage} />
                       </div>
                    )}
                </main>
            );
    }
  };

  return (
    <div className="bg-bg text-on-surface font-sans antialiased w-screen h-screen overflow-hidden flex flex-col">
      {renderMainContent()}

      {isComposing && <ComposeView />}
      {isReplying && <ReplyView />}

      {showBottomNav && <BottomNavBar onMenuClick={() => setDrawerOpen(!isDrawerOpen)} />}

      {showBottomNav && currentView === 'mail' && (
        <button
          onClick={() => setIsComposing(true)}
          className="absolute bottom-20 right-4 bg-primary text-on-primary rounded-full shadow-lg h-14 w-14 flex items-center justify-center hover:opacity-90 transition-opacity z-20"
          aria-label="Compose new email"
        >
          <EditIcon className="h-7 w-7" />
        </button>
      )}

      <MoveModal />

      {confirmationModalConfig && (
        <ConfirmationModal
          isOpen={!!confirmationModalConfig}
          message={confirmationModalConfig.message}
          onConfirm={confirmationModalConfig.onConfirm}
          onClose={handleConfirmModalClose}
        />
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default App;