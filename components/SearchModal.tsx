import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Message } from '../types';
import { Avatar } from './ui/Avatar';
import { ArrowLeftIcon, SearchIcon, XMarkIcon } from './icons';
import { MessageRow } from './MessageRow';

const RecentlyViewedCard: React.FC<{ message: Message }> = ({ message }) => {
    const formatCardDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true
        };
        // Format to "7 Oct at 9:49 am"
        return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', ' at').toLowerCase();
    };

    return (
        <div className="bg-surface p-4 rounded-2xl w-48 flex-shrink-0 flex flex-col h-40 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-on-surface leading-tight pr-2 line-clamp-2 flex-grow">{message.sender.name}</h4>
                <Avatar name={message.sender.name} src={message.sender.avatarUrl} size="sm" className="w-8 h-8 -mt-1 flex-shrink-0" />
            </div>
            <p className="text-sm text-on-surface-variant leading-snug mb-3 line-clamp-2 flex-grow">{message.subject}</p>
            <p className="text-xs text-on-surface-variant">{formatCardDate(message.timestamp)}</p>
        </div>
    );
};

export const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { messages, recentlyViewedMessageIds, setSelectedMessage } = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState('');

    const recentlyViewedEmails = recentlyViewedMessageIds
        .map(id => messages.find(m => m.id === id))
        .filter((m): m is Message => !!m);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) {
            return [];
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return messages.filter(message =>
            message.sender.name.toLowerCase().includes(lowerCaseQuery) ||
            message.subject.toLowerCase().includes(lowerCaseQuery) ||
            message.snippet.toLowerCase().includes(lowerCaseQuery)
        );
    }, [searchQuery, messages]);

    const handleSelectMessage = (message: Message) => {
        setSelectedMessage(message);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-bg z-50 flex flex-col animate-slide-up">
            <header className="flex items-center p-2 shrink-0">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-on-surface/10">
                    <ArrowLeftIcon className="h-6 w-6 text-on-surface" />
                </button>
                <div className="relative flex-grow mx-2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-on-surface-variant" />
                    </div>
                    <input
                        type="search"
                        autoFocus
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full bg-surface-alt border border-transparent rounded-full py-3 pl-11 pr-4 text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </header>
            
            <main className="flex-grow overflow-y-auto px-2 pt-4">
                {searchQuery.trim() ? (
                    <div>
                        {searchResults.length > 0 ? (
                             <div className="space-y-2">
                                {searchResults.map(msg => (
                                    <MessageRow
                                        key={msg.id}
                                        message={msg}
                                        isSelected={false}
                                        isSelectionMode={false}
                                        onSelect={() => handleSelectMessage(msg)}
                                        onToggleSelection={() => {}}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-10 text-on-surface-variant">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="px-2">
                        <section className="mb-8">
                            <h3 className="text-on-surface font-semibold mb-3 px-2">Recent Searches</h3>
                            <div className="flex">
                                <div className="bg-primary-container text-on-surface font-medium px-4 py-2 rounded-full flex items-center space-x-2">
                                    <span>automation</span>
                                    <button aria-label="Remove search term automation">
                                        <XMarkIcon className="h-4 w-4 text-on-surface-variant" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-on-surface font-semibold mb-3 px-2">Recently viewed emails</h3>
                            <div className="flex space-x-3 -mx-2 px-2 overflow-x-auto pb-4">
                            {recentlyViewedEmails.map(msg => <RecentlyViewedCard key={msg.id} message={msg} />)}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
};