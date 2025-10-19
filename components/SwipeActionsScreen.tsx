import React from 'react';
import { ArrowLeftIcon, SwipeLeftIllustration, SwipeRightIllustration } from './icons';
import { IconButton } from './ui/IconButton';

export interface SwipeActionItem {
    id: string;
    name: string;
}
interface SwipeActionsScreenProps {
    onBack: () => void;
    onEdit: (direction: 'left' | 'right') => void;
    leftActions: SwipeActionItem[];
    rightActions: SwipeActionItem[];
}

const ActionCard: React.FC<{
    title: string;
    actions: SwipeActionItem[];
    illustration: React.ReactNode;
    onClick: () => void;
}> = ({ title, actions, illustration, onClick }) => (
    <button onClick={onClick} className="w-full bg-surface rounded-xl shadow-sm p-4 text-left">
        <div className="flex items-center">
            <div className="w-24 h-24 mr-4 flex-shrink-0">
                {illustration}
            </div>
            <div className="flex-grow">
                <h3 className="font-semibold text-lg text-on-surface">{title}</h3>
                <p className="text-on-surface-variant mt-1">
                    {actions.map(a => a.name).join(', ')}
                </p>
            </div>
        </div>
    </button>
);


export const SwipeActionsScreen: React.FC<SwipeActionsScreenProps> = ({ onBack, onEdit, leftActions, rightActions }) => {
    return (
        <div className="bg-bg h-full flex flex-col">
            <header className="bg-surface flex items-center p-4 shrink-0">
                <IconButton label="Back" onClick={onBack} className="-ml-2">
                    <ArrowLeftIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
                <h2 className="text-xl font-bold text-on-surface ml-4">Swipe actions</h2>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <ActionCard
                    title="Swipe left"
                    actions={leftActions}
                    illustration={<SwipeLeftIllustration className="w-full h-full" />}
                    onClick={() => onEdit('left')}
                />
                 <ActionCard
                    title="Swipe right"
                    actions={rightActions}
                    illustration={<SwipeRightIllustration className="w-full h-full" />}
                    onClick={() => onEdit('right')}
                />
            </main>
        </div>
    );
};