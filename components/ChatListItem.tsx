import React from 'react';
import { GroupChat } from '../types';
import { UsersIcon, ReadReceiptIcon } from './icons';

interface ChatListItemProps {
  chat: GroupChat;
  onClick: () => void;
}

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) return 'Now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
};

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onClick }) => {
  const LastMessageIcon = chat.lastMessageIcon;

  return (
    <button onClick={onClick} className="w-full flex items-center px-4 py-3 text-left hover:bg-surface-alt transition-colors rounded-lg">
      <div className={`h-12 w-12 rounded-full ${chat.avatarColor} flex items-center justify-center mr-4 shrink-0`}>
        <UsersIcon className="h-7 w-7 text-on-surface/70" />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-on-surface truncate pr-2">{chat.name}</h3>
          <p className="text-xs text-on-surface-variant shrink-0">{formatTimestamp(chat.timestamp)}</p>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <div className="text-sm text-on-surface-variant truncate pr-2 flex items-center">
            {LastMessageIcon && <LastMessageIcon className="h-4 w-4 mr-1.5 shrink-0" />}
            <span>{chat.lastMessage}</span>
          </div>
          {chat.readReceiptStatus !== 'none' && (
            <ReadReceiptIcon status={chat.readReceiptStatus} className="text-on-surface-variant shrink-0" />
          )}
        </div>
      </div>
    </button>
  );
};