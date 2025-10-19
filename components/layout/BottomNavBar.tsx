import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { DocumentDuplicateIcon, ChatBubbleLeftIcon, FolderIcon } from '../icons';

interface BottomNavBarProps {
    onMenuClick: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onMenuClick }) => {
    const { currentView, setCurrentView } = useContext(AppContext);
    
    const isMailActive = currentView === 'mail';
    const isAiActive = currentView === 'ai';
    const isChatActive = currentView === 'chatList';
    const isDriveActive = currentView === 'drive';

    const handleMailClick = () => {
        if (isMailActive) {
            onMenuClick();
        } else {
            setCurrentView('mail');
        }
    };

    const handleAiClick = () => {
        if (isAiActive) return;
        setCurrentView('ai');
    };

    const handleChatClick = () => {
        if (isChatActive) return;
        setCurrentView('chatList');
    };
    
    const handleStorageClick = () => {
        setCurrentView('drive');
    };
    
    return (
        <footer className="bg-surface border-t border-outline flex items-center justify-around h-16 shrink-0 z-10">
            <button onClick={handleMailClick} className={`flex items-center justify-center h-10 w-16 ${isMailActive ? 'bg-primary-container' : ''} rounded-full`}>
                <DocumentDuplicateIcon className="h-6 w-6 text-on-surface"/>
            </button>

            <button onClick={handleAiClick} className={`flex items-center justify-center h-10 rounded-full font-semibold transition-all duration-200 ${isAiActive ? 'bg-primary-container text-on-surface px-8' : 'text-on-surface-variant w-16'}`}>
                AI
            </button>

            <button onClick={handleChatClick} className={`flex items-center justify-center h-10 w-16 ${isChatActive ? 'bg-primary-container' : ''} rounded-full`}>
                <ChatBubbleLeftIcon className={`h-6 w-6 ${isChatActive ? 'text-on-surface' : 'text-on-surface-variant'}`} />
            </button>

            <button onClick={handleStorageClick} className={`flex items-center justify-center h-10 w-16 ${isDriveActive ? 'bg-primary-container' : ''} rounded-full`}>
                <FolderIcon className={`h-6 w-6 ${isDriveActive ? 'text-on-surface' : 'text-on-surface-variant'}`} />
            </button>
        </footer>
    );
};