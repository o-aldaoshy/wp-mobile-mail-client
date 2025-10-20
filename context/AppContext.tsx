import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Account, Folder, Message, ReplyType, Theme, GroupChat, ActiveFilters, SortOrder } from '../types';
import { ACCOUNTS, FOLDERS, MESSAGES, INITIAL_GROUP_CHATS } from '../constants';

interface ConfirmationModalConfig {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export type AppView = 'mail' | 'ai' | 'chatList' | 'groupSelectMembers' | 'groupName' | 'groupChat' | 'drive';

interface AppContextType {
  accounts: Account[];
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  messages: Message[];
  selectedFolder: Folder | null;
  setSelectedFolder: (folder: Folder) => void;
  selectedMessage: Message | null;
  setSelectedMessage: (message: Message | null) => void;
  isComposing: boolean;
  setIsComposing: (isComposing: boolean) => void;
  isReplying: boolean;
  setIsReplying: (isReplying: boolean) => void;
  replyingToMessage: Message | null;
  setReplyingToMessage: (message: Message | null) => void;
  replyType: ReplyType | null;
  setReplyType: (type: ReplyType | null) => void;
  isSelectionMode: boolean;
  setIsSelectionMode: (isSelectionMode: boolean) => void;
  selectedMessageIds: Set<string>;
  toggleMessageSelection: (messageId: string) => void;
  selectAllMessages: (messageIds: string[]) => void;
  clearSelection: () => void;
  isMoveModalOpen: boolean;
  setIsMoveModalOpen: (isOpen: boolean) => void;
  isAddFolderModalOpen: boolean;
  setIsAddFolderModalOpen: (isOpen: boolean) => void;
  confirmationModalConfig: ConfirmationModalConfig | null;
  setConfirmationModalConfig: (config: ConfirmationModalConfig | null) => void;
  theme: Theme;
  darkModeOption: string;
  setDarkModeOption: (option: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  initialSettingsView: string | null;
  setInitialSettingsView: (view: string | null) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  groupChatInfo: { id: string, name: string } | null;
  setGroupChatInfo: (info: { id: string, name: string } | null) => void;
  groupChats: GroupChat[];
  setGroupChats: React.Dispatch<React.SetStateAction<GroupChat[]>>;
  recentlyViewedMessageIds: string[];
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (isOpen: boolean) => void;
  activeFilters: ActiveFilters;
  setActiveFilters: (filters: ActiveFilters) => void;
  sortOrder: SortOrder;
  setSortOrder: (sortOrder: SortOrder) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts] = useState<Account[]>(ACCOUNTS);
  const [folders, setFolders] = useState<Folder[]>(FOLDERS);
  const [messages] = useState<Message[]>(MESSAGES);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(FOLDERS[0]);
  const [selectedMessage, setSelectedMessageState] = useState<Message | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [replyType, setReplyType] = useState<ReplyType | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(new Set());
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [confirmationModalConfig, setConfirmationModalConfig] = useState<ConfirmationModalConfig | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [initialSettingsView, setInitialSettingsView] = useState<string | null>(null);
  
  const [currentView, setCurrentView] = useState<AppView>('mail');
  const [groupChatInfo, setGroupChatInfo] = useState<{ id: string, name: string } | null>(null);
  const [groupChats, setGroupChats] = useState<GroupChat[]>(INITIAL_GROUP_CHATS);
  
  const [darkModeOption, setDarkModeOptionState] = useState<string>(() => {
    return localStorage.getItem('darkModeOption') || 'Off';
  });
  const [theme, setThemeState] = useState<Theme>('light');

  const [recentlyViewedMessageIds, setRecentlyViewedMessageIds] = useState<string[]>(['msg_aws', 'msg_google']);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const initialFilters: ActiveFilters = {
    unread: false,
    starred: false,
    attachments: false,
    unanswered: false,
    favorites: false,
    personal: false,
    social: false,
    updates: false,
    forums: false,
  };
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);

  const [sortOrder, setSortOrder] = useState<SortOrder>({ key: 'date', direction: 'desc' });

  const setSelectedMessage = (message: Message | null) => {
    setSelectedMessageState(message);
    if (message) {
      setRecentlyViewedMessageIds(prevIds => {
        const newIds = [message.id, ...prevIds.filter(id => id !== message.id)];
        return newIds.slice(0, 10); // Keep only the last 10 viewed
      });
    }
  };

  const setDarkModeOption = (option: string) => {
    localStorage.setItem('darkModeOption', option);
    setDarkModeOptionState(option);
  };

  useEffect(() => {
    let newTheme: Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (darkModeOption === 'On') {
      newTheme = 'dark';
    } else if (darkModeOption === 'Off') {
      newTheme = 'light';
    } else { // 'Match phone setting'
      newTheme = systemPrefersDark ? 'dark' : 'light';
    }
    setThemeState(newTheme);
  }, [darkModeOption]);
  
  useEffect(() => {
    if (darkModeOption !== 'Match phone setting') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setThemeState(mediaQuery.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [darkModeOption]);

  const toggleMessageSelection = useCallback((messageId: string) => {
    setSelectedMessageIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const selectAllMessages = useCallback((messageIds: string[]) => {
      if (selectedMessageIds.size === messageIds.length) {
          setSelectedMessageIds(new Set());
      } else {
          setSelectedMessageIds(new Set(messageIds));
      }
  }, [selectedMessageIds.size]);

  const clearSelection = useCallback(() => {
      setSelectedMessageIds(new Set());
  }, []);


  return (
    <AppContext.Provider
      value={{
        accounts,
        folders,
        setFolders,
        messages,
        selectedFolder,
        setSelectedFolder,
        selectedMessage,
        setSelectedMessage,
        isComposing,
        setIsComposing,
        isReplying,
        setIsReplying,
        replyingToMessage,
        setReplyingToMessage,
        replyType,
        setReplyType,
        isSelectionMode,
        setIsSelectionMode,
        selectedMessageIds,
        toggleMessageSelection,
        selectAllMessages,
        clearSelection,
        isMoveModalOpen,
        setIsMoveModalOpen,
        isAddFolderModalOpen,
        setIsAddFolderModalOpen,
        confirmationModalConfig,
        setConfirmationModalConfig,
        theme,
        darkModeOption,
        setDarkModeOption,
        isSettingsOpen,
        setIsSettingsOpen,
        isSearchOpen,
        setIsSearchOpen,
        initialSettingsView,
        setInitialSettingsView,
        currentView,
        setCurrentView,
        groupChatInfo,
        setGroupChatInfo,
        groupChats,
        setGroupChats,
        recentlyViewedMessageIds,
        isFilterModalOpen,
        setIsFilterModalOpen,
        activeFilters,
        setActiveFilters,
        sortOrder,
        setSortOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};