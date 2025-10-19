import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { IconButton } from './ui/IconButton';
import { ArrowLeftIcon, VideoCameraIcon, EllipsisVerticalIcon, UsersIcon, FaceSmileIcon, CameraIcon, MicrophoneIcon, PlusIcon, PaperAirplaneIcon } from './icons';

export const GroupChatView: React.FC = () => {
    const { setCurrentView, groupChatInfo, setGroupChatInfo, groupChats, setGroupChats } = useContext(AppContext);
    const [inputValue, setInputValue] = useState('');
    
    const currentChat = groupChats.find(c => c.id === groupChatInfo?.id);
    const [messages, setMessages] = useState(currentChat?.messages || []);

    const handleBack = () => {
        setCurrentView('chatList');
        setGroupChatInfo(null);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !groupChatInfo) return;

        const newMessage = { text: inputValue, sender: 'user' as const };
        setMessages(prev => [...prev, newMessage]);

        setGroupChats(prevChats => prevChats.map(chat => 
            chat.id === groupChatInfo.id 
            ? { 
                ...chat, 
                lastMessage: inputValue, 
                timestamp: new Date(), 
                lastMessageIcon: undefined, 
                readReceiptStatus: 'sent',
                messages: [...(chat.messages || []), newMessage]
              } 
            : chat
        ));
        setInputValue('');
    };
    
    const groupName = groupChatInfo?.name || 'New Group';

    return (
        <div className="bg-bg text-on-surface h-full flex flex-col">
            <header className="flex items-center p-4 shrink-0 border-b border-outline">
                <IconButton label="Back" onClick={handleBack} className="-ml-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </IconButton>
                <div className="h-10 w-10 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center mr-3 ml-2">
                    <UsersIcon className="h-6 w-6 text-blue-700 dark:text-blue-200" />
                </div>
                <div className="flex-grow">
                    <h1 className="text-lg font-bold">{groupName}</h1>
                    <p className="text-sm text-on-surface-variant">You</p>
                </div>
                <IconButton label="Video call"><VideoCameraIcon className="h-6 w-6" /></IconButton>
                <IconButton label="More options"><EllipsisVerticalIcon className="h-6 w-6" /></IconButton>
            </header>

            <main className="flex-grow overflow-y-auto px-4 py-8 flex flex-col">
                {messages.length === 0 || (messages.length === 1 && messages[0].sender === 'system') ? (
                    <>
                        <div className="h-24 w-24 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center mb-4">
                            <UsersIcon className="h-12 w-12 text-blue-700 dark:text-blue-200" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">{groupName}</h2>
                        <div className="flex items-center space-x-2 bg-surface-alt px-4 py-2 rounded-full text-sm font-medium text-on-surface-variant mb-6">
                            <UsersIcon className="h-5 w-5" />
                            <span>No other group members yet</span>
                        </div>
                        
                        <div className="text-sm text-on-surface-variant mb-4">Today</div>

                        <div className="flex items-center space-x-2 text-sm text-on-surface-variant mb-4">
                            <UsersIcon className="h-5 w-5" />
                            <span>You created the group.</span>
                        </div>

                        <button className="bg-surface-alt px-4 py-2 rounded-full font-semibold text-on-surface">
                            Invite friends
                        </button>
                    </>
                ) : (
                    <div className="w-full space-y-4">
                        {messages.map((msg, index) => {
                            if (msg.sender === 'user') {
                                return (
                                     <div key={index} className="flex justify-end">
                                        <div className="bg-primary text-on-primary p-3 rounded-2xl rounded-br-lg max-w-sm">
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                )}
            </main>

            <footer className="p-2 shrink-0">
                <form onSubmit={handleSend} className="flex items-center bg-surface rounded-full p-1.5">
                    <IconButton label="Emoji"><FaceSmileIcon className="h-6 w-6" /></IconButton>
                    <input
                        type="text"
                        placeholder="Signal message"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-grow bg-transparent outline-none px-2 text-on-surface placeholder:text-on-surface-variant"
                    />
                    <IconButton label="Attach image"><CameraIcon className="h-6 w-6" /></IconButton>
                    <IconButton label="Record voice message"><MicrophoneIcon className="h-6 w-6" /></IconButton>
                    
                    {inputValue.trim() ? (
                        <button type="submit" className="bg-primary h-10 w-10 rounded-full flex items-center justify-center">
                            <PaperAirplaneIcon className="h-6 w-6 text-on-primary" />
                        </button>
                    ) : (
                         <button type="button" className="bg-primary h-10 w-10 rounded-full flex items-center justify-center">
                            <PlusIcon className="h-6 w-6 text-on-primary" />
                        </button>
                    )}
                </form>
            </footer>
        </div>
    );
};