import React, { useState } from 'react';
import { ArrowLeftIcon, ChevronUpDownIcon, CheckCircleVIcon } from './icons';
import { IconButton } from './ui/IconButton';

interface ManageFoldersScreenProps {
    onBack: () => void;
}

const FOLDER_LIST = [
    'Inbox', 'Unread', 'Flagged', 'Snoozed', 'VIPs', 
    'Saved emails', 'Drafts', 'Outbox', 'Sent', 
    'Recycle bin', 'Spam'
];

export const ManageFoldersScreen: React.FC<ManageFoldersScreenProps> = ({ onBack }) => {
    
    const initialCheckedState = FOLDER_LIST.reduce((acc, folder) => {
        acc[folder] = true;
        return acc;
    }, {} as Record<string, boolean>);

    const [checkedFolders, setCheckedFolders] = useState(initialCheckedState);

    const handleToggle = (folderName: string) => {
        if (folderName === 'Inbox') return; // Inbox is not toggleable
        setCheckedFolders(prev => ({
            ...prev,
            [folderName]: !prev[folderName]
        }));
    };

    return (
        <div className="bg-bg h-full flex flex-col">
            <header className="bg-surface flex items-center p-4 shrink-0">
                <IconButton label="Back" onClick={onBack} className="-ml-2">
                    <ArrowLeftIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
                <h2 className="text-xl font-bold text-on-surface ml-4">Manage folders</h2>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4">
                <div className="bg-surface rounded-xl shadow-sm">
                    <ul>
                        {FOLDER_LIST.map((folderName, index) => {
                            const isInbox = folderName === 'Inbox';
                            const isChecked = checkedFolders[folderName];
                            
                            return (
                                <li key={folderName} className={`flex items-center px-4 ${index > 0 ? 'border-t border-outline' : ''}`}>
                                    <button 
                                        onClick={() => handleToggle(folderName)}
                                        className="py-3.5 flex items-center flex-grow"
                                        disabled={isInbox}
                                        aria-label={`Toggle visibility for ${folderName} folder`}
                                        aria-checked={isChecked}
                                    >
                                        {isInbox ? (
                                            <div className="w-6 h-6 rounded-full bg-orange-50 mr-4 flex-shrink-0" />
                                        ) : isChecked ? (
                                            <CheckCircleVIcon className="h-6 w-6 mr-4 flex-shrink-0" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex-shrink-0" />
                                        )}
                                        <span className={`font-medium ${isInbox ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                                            {folderName}
                                        </span>
                                    </button>
                                    <ChevronUpDownIcon className="h-6 w-6 text-on-surface-variant flex-shrink-0" />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </main>
        </div>
    );
};