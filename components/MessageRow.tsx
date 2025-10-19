import React, { useState, useRef, useMemo, PointerEvent, useContext } from 'react';
import { Message } from '../types';
import {
    PinIcon,
    PaperClipIcon,
    CheckIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    ArchiveBoxIcon,
    ClockIcon,
    EnvelopeOpenIcon,
    ArrowUturnLeftIcon,
} from './icons';
import { AppContext } from '../context/AppContext';

interface MessageRowProps {
  message: Message;
  isSelected: boolean;
  isSelectionMode: boolean;
  onSelect: (message: Message) => void;
  onToggleSelection: (messageId: string) => void;
}

const formatDate = (date: Date): string => {
    const now = new Date();
    
    if (now.toDateString() === date.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

const SelectionCircle: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  if (isSelected) {
    return (
      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center mr-3 shrink-0">
        <CheckIcon className="h-4 w-4 text-white" />
      </div>
    );
  }
  return <div className="w-6 h-6 rounded-full border-2 border-on-surface-variant/50 mr-3 shrink-0" />;
};

const SWIPE_THRESHOLD = 60; // Min distance to swipe before it's considered a commit
const ACTION_ITEM_WIDTH = 80; // 5rem or w-20

interface SwipeActionProps {
    icon: React.ElementType;
    label: string;
    bgColor: string;
    onClick: () => void;
}

const SwipeAction: React.FC<SwipeActionProps> = ({ icon: Icon, label, bgColor, onClick }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className={`flex flex-col items-center justify-center h-full text-white ${bgColor}`}
        style={{ width: `${ACTION_ITEM_WIDTH}px`}}
        aria-label={label}
    >
        <Icon className="h-6 w-6" />
        <span className="text-xs mt-1">{label}</span>
    </button>
);


export const MessageRow: React.FC<MessageRowProps> = ({ message, isSelected, isSelectionMode, onSelect, onToggleSelection }) => {
    const { setIsMoveModalOpen, clearSelection, setConfirmationModalConfig } = useContext(AppContext);
    const formattedDate = useMemo(() => formatDate(message.timestamp), [message.timestamp]);
    const swipeableContentRef = useRef<HTMLDivElement>(null);
    const [translateX, setTranslateX] = useState(0);
    const [isPointerDown, setIsPointerDown] = useState(false);
    const hasSwipedRef = useRef(false);
    const startXRef = useRef(0);
    
    const rightActionsCount = 4;
    const leftActionsCount = 2;

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (isSelectionMode || e.button !== 0) return;
        startXRef.current = e.clientX;
        hasSwipedRef.current = false;
        setIsPointerDown(true);
        swipeableContentRef.current?.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (!isPointerDown || isSelectionMode) return;
        
        const currentX = e.clientX;
        const diff = currentX - startXRef.current;

        if (Math.abs(diff) > 10) {
            hasSwipedRef.current = true;
        }

        const rightMax = ACTION_ITEM_WIDTH * rightActionsCount;
        const leftMax = ACTION_ITEM_WIDTH * leftActionsCount;
        let newTranslateX = diff;
        if (diff > rightMax) {
            newTranslateX = rightMax + (diff - rightMax) * 0.4;
        } else if (diff < -leftMax) {
            newTranslateX = -leftMax + (diff + leftMax) * 0.4;
        }
        
        setTranslateX(newTranslateX);
    };

    const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
        if (!isPointerDown || isSelectionMode) return;
        swipeableContentRef.current?.releasePointerCapture(e.pointerId);
        setIsPointerDown(false);
        
        const rightSnapPoint = ACTION_ITEM_WIDTH * rightActionsCount;
        const leftSnapPoint = -(ACTION_ITEM_WIDTH * leftActionsCount);

        if (translateX > SWIPE_THRESHOLD) {
            setTranslateX(rightSnapPoint);
        } else if (translateX < -SWIPE_THRESHOLD) {
            setTranslateX(leftSnapPoint);
        } else {
            setTranslateX(0);
        }
    };

    const handleClick = () => {
        if (hasSwipedRef.current) {
            // Reset hasSwipedRef after a swipe, so the next click is not ignored.
            hasSwipedRef.current = false;
            return;
        }

        if (translateX !== 0) {
            setTranslateX(0);
            return; // Consume the click to close the swipe actions
        }

        if (isSelectionMode) {
          onToggleSelection(message.id);
        } else {
          onSelect(message);
        }
    };

    const handleSwipeMove = () => {
        setConfirmationModalConfig({
            message: 'Move this conversation?',
            onConfirm: () => {
                clearSelection();
                onToggleSelection(message.id);
                setIsMoveModalOpen(true);
                setTranslateX(0);
            },
            onCancel: () => {
                setTranslateX(0);
            }
        });
    }

    const handleActionClick = (action: string) => {
        alert(`Action: ${action}\nSubject: ${message.subject}`);
        setTranslateX(0);
    };

    const rowClasses = `p-4 rounded-lg transition-colors duration-150 ${
        isSelected ? 'bg-primary-container' : 'bg-surface'
    }`;
    const senderClasses = !message.isRead && !isSelectionMode ? 'font-bold text-on-surface' : 'font-medium text-on-surface';

    const RightActions = () => (
        <div className="absolute inset-y-0 left-0 flex items-center rounded-lg overflow-hidden">
            <SwipeAction icon={ArchiveBoxIcon} label="Move" bgColor="bg-primary" onClick={handleSwipeMove} />
            <SwipeAction icon={ClockIcon} label="Due Date" bgColor="bg-on-surface-variant" onClick={() => handleActionClick('Set Due Date')} />
            <SwipeAction icon={EnvelopeOpenIcon} label="Read" bgColor="bg-on-surface-variant" onClick={() => handleActionClick('Read')} />
            <SwipeAction icon={ArrowUturnLeftIcon} label="Reply" bgColor="bg-on-surface-variant" onClick={() => handleActionClick('Reply')} />
        </div>
    );
    
    const LeftActions = () => (
        <div className="absolute inset-y-0 right-0 flex items-center rounded-lg overflow-hidden">
            <SwipeAction icon={ExclamationTriangleIcon} label="Spam" bgColor="bg-accent" onClick={() => handleActionClick('Mark as spam')} />
            <SwipeAction icon={TrashIcon} label="Delete" bgColor="bg-error" onClick={() => handleActionClick('Delete')} />
        </div>
    );

    return (
        <div className="relative bg-surface rounded-lg overflow-hidden">
            {!isSelectionMode && (
                <>
                    <LeftActions />
                    <RightActions />
                </>
            )}
            <div
                ref={swipeableContentRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onClick={handleClick}
                style={{ 
                    transform: `translateX(${translateX}px)`,
                    transition: isPointerDown ? 'none' : 'transform 0.3s cubic-bezier(0.1, 0.7, 0.6, 1)',
                    touchAction: 'pan-y',
                }}
                className={`relative z-10 w-full cursor-pointer`}
            >
                <div className={rowClasses}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center truncate">
                            {isSelectionMode ? (
                              <SelectionCircle isSelected={isSelected} />
                            ) : (
                              !message.isRead && <div className="w-2 h-2 bg-accent rounded-full mr-3 shrink-0" />
                            )}
                            <p className={`truncate ${senderClasses}`}>{message.sender.name}</p>
                            {message.isThread && message.threadCount && message.threadCount > 1 && (
                                <span className="ml-2 bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{message.threadCount}</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 ml-2">
                            {message.attachments.length > 0 && <PaperClipIcon className="h-4 w-4 text-on-surface-variant" />}
                            <span className="text-xs text-on-surface-variant">{formattedDate}</span>
                        </div>
                    </div>

                    <div className="pl-5 mt-1">
                        <p className={`text-on-surface-variant truncate ${isSelectionMode ? 'ml-4' : ''}`}>{message.subject}</p>
                    </div>

                    <div className="pl-5 mt-1 flex justify-between items-start">
                        <p className={`text-on-surface-variant text-sm truncate pr-2 ${isSelectionMode ? 'ml-4' : ''}`}>{message.snippet}</p>
                        {message.isFlagged && <PinIcon className="h-5 w-5 text-on-surface-variant shrink-0 ml-2" />}
                    </div>
                </div>
            </div>
        </div>
    );
};