import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Folder } from '../types';
import { InboxArrowDownIcon, FolderOpenIcon, TrashIcon } from './icons';

// Specific list of folders to show in the Move modal, as per the screenshot
const MOVE_MODAL_FOLDERS = [
  { id: 'inbox', name: 'Inbox', icon: InboxArrowDownIcon },
  { id: 'drafts', name: 'Drafts', icon: FolderOpenIcon },
  { id: 'outbox', name: 'Outbox', icon: FolderOpenIcon },
  { id: 'sent', name: 'Sent', icon: FolderOpenIcon },
  { id: 'recycle', name: 'Recycle bin', icon: TrashIcon },
  { id: 'spam', name: 'Spam', icon: FolderOpenIcon },
  { id: 'archive', name: 'Archive', icon: FolderOpenIcon },
  { id: 'rss', name: 'RSS Feeds', icon: FolderOpenIcon },
];

export const MoveModal: React.FC = () => {
    const {
        isMoveModalOpen,
        setIsMoveModalOpen,
        selectedMessageIds,
        setIsSelectionMode,
        clearSelection,
    } = useContext(AppContext);

    const handleClose = () => {
        setIsMoveModalOpen(false);
    };

    const handleMove = (folder: {id: string, name: string}) => {
        alert(`Moved ${selectedMessageIds.size} message(s) to ${folder.name}`);
        handleClose();
        setIsSelectionMode(false);
        clearSelection();
    };

    if (!isMoveModalOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="move-modal-title"
        >
            <div
                className="fixed inset-0 bg-black/30 transition-opacity"
                onClick={handleClose}
                aria-hidden="true"
            />
            
            <div
                className="relative bg-surface rounded-2xl shadow-xl w-full max-w-sm"
            >
                <div className="p-4 pt-6">
                    <h2 id="move-modal-title" className="text-2xl font-bold text-on-surface mb-4 px-3">
                       Select folder
                    </h2>
                    
                    <ul className="space-y-1">
                        {MOVE_MODAL_FOLDERS.map((folder) => (
                            <li key={folder.id}>
                                <button
                                    onClick={() => handleMove(folder)}
                                    className="w-full flex items-center p-3 text-left text-on-surface hover:bg-primary-container/50 rounded-lg transition-colors"
                                >
                                    <folder.icon className="h-6 w-6 mr-4 text-on-surface-variant" />
                                    <span className="font-medium">{folder.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};