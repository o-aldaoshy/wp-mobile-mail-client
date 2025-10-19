import React, { useState, useRef } from 'react';
import {
    ArrowLeftIcon,
    TrashIcon,
    ForwardIcon,
    MoveIcon,
    ArrowUturnLeftIcon,
    ReplyAllIcon,
    CalendarPlusIcon,
    ClipboardPlusIcon,
    SnoozeIcon,
    EnvelopeXMarkIcon,
    EnvelopeOpenIcon,
    ArrowDownOnSquareIcon,
    CheckCircleVIcon,
} from './icons';
import { IconButton } from './ui/IconButton';
import type { SwipeActionItem } from './SwipeActionsScreen';

interface EditSwipeActionScreenProps {
    direction: 'left' | 'right';
    initialActions: SwipeActionItem[];
    onSave: (actions: SwipeActionItem[]) => void;
    onBack: () => void;
}

export const ALL_SWIPE_ACTIONS = [
    { id: 'delete', name: 'Delete', icon: TrashIcon },
    { id: 'forward', name: 'Forward', icon: ForwardIcon },
    { id: 'move', name: 'Move', icon: MoveIcon },
    { id: 'reply', name: 'Reply', icon: ArrowUturnLeftIcon },
    { id: 'reply_all', name: 'Reply all', icon: ReplyAllIcon },
    { id: 'create_event', name: 'Create event', icon: CalendarPlusIcon },
    { id: 'create_task', name: 'Create task', icon: ClipboardPlusIcon },
    { id: 'snooze', name: 'Snooze', icon: SnoozeIcon },
    { id: 'spam', name: 'Mark as spam', icon: EnvelopeXMarkIcon },
    { id: 'unread', name: 'Unread', icon: EnvelopeOpenIcon },
    { id: 'save', name: 'Save', icon: ArrowDownOnSquareIcon },
];

const SelectedAction: React.FC<{ action: SwipeActionItem; isDragging: boolean }> = ({ action, isDragging }) => {
    const Icon = ALL_SWIPE_ACTIONS.find(a => a.id === action.id)?.icon;
    return (
        <div
            className={`flex flex-col items-center space-y-1 p-2 transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            {Icon && <Icon className="h-6 w-6 text-white" />}
            <span className="text-xs text-white">{action.name}</span>
        </div>
    );
};

const AvailableAction: React.FC<{
    action: { id: string, name: string, icon: React.ElementType },
    isSelected: boolean,
    onToggle: (id: string) => void,
}> = ({ action, isSelected, onToggle }) => {
    return (
        <button
            onClick={() => onToggle(action.id)}
            className="flex flex-col items-center justify-start space-y-2"
            aria-pressed={isSelected}
        >
            <action.icon className={`h-6 w-6 ${isSelected ? 'text-accent' : 'text-on-surface-variant'}`} />
            <span className={`text-sm text-center ${isSelected ? 'text-accent' : 'text-on-surface-variant'}`}>{action.name}</span>
            {isSelected ? (
                <CheckCircleVIcon className="h-6 w-6" />
            ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
            )}
        </button>
    );
};

export const EditSwipeActionScreen: React.FC<EditSwipeActionScreenProps> = ({ direction, initialActions, onBack, onSave }) => {
    const [selectedActions, setSelectedActions] = useState<SwipeActionItem[]>(initialActions);
    const draggedItemIndex = useRef<number | null>(null);
    const dragOverItemIndex = useRef<number | null>(null);

    const handleToggleAction = (actionId: string) => {
        const action = ALL_SWIPE_ACTIONS.find(a => a.id === actionId);
        if (!action) return;

        setSelectedActions(prev => {
            const isSelected = prev.some(a => a.id === actionId);
            if (isSelected) {
                return prev.filter(a => a.id !== actionId);
            } else {
                if (prev.length < 4) {
                    return [...prev, { id: action.id, name: action.name }];
                }
            }
            return prev;
        });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        draggedItemIndex.current = index;
        e.dataTransfer.effectAllowed = 'move';
        // Hide the default drag ghost image
        e.dataTransfer.setDragImage(new Image(), 0, 0);
    };

    const handleDragEnter = (index: number) => {
        dragOverItemIndex.current = index;
    };

    const handleDragEnd = () => {
        if (draggedItemIndex.current === null || dragOverItemIndex.current === null) return;
        
        const newActions = [...selectedActions];
        const [draggedItem] = newActions.splice(draggedItemIndex.current, 1);
        newActions.splice(dragOverItemIndex.current, 0, draggedItem);
        
        draggedItemIndex.current = null;
        dragOverItemIndex.current = null;
        setSelectedActions(newActions);
    };

    const handleSaveAndBack = () => {
        onSave(selectedActions);
        onBack();
    }
    
    return (
        <div className="bg-bg h-full flex flex-col">
            <header className="bg-surface flex items-center p-4 shrink-0">
                <IconButton label="Back" onClick={handleSaveAndBack} className="-ml-2">
                    <ArrowLeftIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
                <h2 className="text-xl font-bold text-on-surface ml-4 capitalize">Swipe {direction}</h2>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <p className="text-on-surface-variant text-center px-4">You can select up to 4 actions and drag to reorder them.</p>

                <div className="bg-blue-500 rounded-2xl h-24 flex items-center justify-center px-4">
                    {selectedActions.length > 0 ? (
                         <div className="flex items-center justify-around w-full">
                            {selectedActions.map((action, index) => (
                                <div
                                    key={action.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={() => handleDragEnter(index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="cursor-move"
                                >
                                    <SelectedAction 
                                        action={action} 
                                        isDragging={draggedItemIndex.current === index} 
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-blue-100 opacity-75">Selected actions appear here</div>
                    )}
                </div>

                <div className="bg-surface rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-on-surface mb-4">Available actions</h3>
                    <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                        {ALL_SWIPE_ACTIONS.map(action => (
                            <AvailableAction
                                key={action.id}
                                action={action}
                                isSelected={selectedActions.some(sa => sa.id === action.id)}
                                onToggle={handleToggleAction}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};