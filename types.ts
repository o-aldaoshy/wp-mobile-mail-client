import React from "react";

export interface Attachment {
  id: string;
  fileName: string;
  size: string;
  type: 'image' | 'pdf' | 'document' | 'other';
}

export enum SmimeStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
  UNKNOWN = 'UNKNOWN',
  NONE = 'NONE'
}

export type MessageCategory = 'Primary' | 'Promotions' | 'Social' | 'Updates' | 'Forums';

export interface Message {
  id: string;
  sender: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  recipients: {
    to: string[];
    cc?: string[];
    bcc?: string[];
  };
  subject: string;
  snippet: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  isFlagged: boolean;
  isThread: boolean;
  threadId?: string;
  threadCount?: number;
  attachments: Attachment[];
  folder: string;
  smimeStatus: SmimeStatus;
  isAnswered: boolean;
  isFavorite: boolean;
  labels?: ('Personal' | 'Social' | 'Updates' | 'Forums')[];
  category: MessageCategory;
}

export interface Folder {
  id: string;
  name: string;
  icon: React.ElementType;
  unreadCount?: number;
  isVip?: boolean;
  color?: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  providerIcon?: React.ElementType;
  folders: Folder[];
}

export type Theme = 'light' | 'dark';
export type ReplyType = 'reply' | 'reply-all' | 'forward';

export type ReadReceiptStatus = 'sent' | 'delivered' | 'read' | 'none';

export interface GroupChat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageIcon?: React.ElementType;
  timestamp: Date;
  avatarColor: string;
  readReceiptStatus: ReadReceiptStatus;
  messages: { text: string; sender: 'user' | 'system' }[];
}

export interface ActiveFilters {
  unread: boolean;
  starred: boolean;
  attachments: boolean;
  unanswered: boolean;
  favorites: boolean;
  personal: boolean;
  social: boolean;
  updates: boolean;
  forums: boolean;
}

export interface DriveFile {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'pdf' | 'video' | 'doc';
  size?: string;
  modifiedDate: Date;
  itemCount?: number; // for folders
  thumbnailUrl?: string; // for images
}

export type SortKey = 'date' | 'sender' | 'subject' | 'unread';
export type SortDirection = 'asc' | 'desc';
export interface SortOrder {
  key: SortKey;
  direction: SortDirection;
}