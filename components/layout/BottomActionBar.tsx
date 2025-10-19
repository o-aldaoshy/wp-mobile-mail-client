import React, { useState, useContext } from 'react';
import { 
    ArrowRightOnRectangleIcon, 
    EnvelopeOpenIcon, 
    TrashIcon, 
    EllipsisVerticalIcon 
} from '../icons';
import { AppContext } from '../../context/AppContext';

interface ActionButtonProps {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors w-24 py-1">
        <Icon className="h-6 w-6 mb-1" />
        <span className="text-xs font-medium">{label}</span>
    </button>
);


export const BottomActionBar: React.FC<{ selectedIds: string[] }> = ({ selectedIds }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { setIsMoveModalOpen, setConfirmationModalConfig } = useContext(AppContext);
    
    if (selectedIds.length === 0) {
        return null;
    }

    const handleMoveClick = () => {
        const count = selectedIds.length;
        setConfirmationModalConfig({
            message: `Move ${count} conversation${count > 1 ? 's' : ''}?`,
            onConfirm: () => {
                setIsMoveModalOpen(true);
            },
        });
    };
    
    return (
        <div className="relative shrink-0">
            <div className="flex items-center justify-around py-1 bg-surface border-t border-outline">
                <ActionButton icon={ArrowRightOnRectangleIcon} label="Move" onClick={handleMoveClick} />
                <ActionButton icon={EnvelopeOpenIcon} label="Read" />
                <ActionButton icon={TrashIcon} label="Delete" />
                <ActionButton icon={EllipsisVerticalIcon} label="More" onClick={() => setIsMenuOpen(o => !o)} />
            </div>

            {isMenuOpen && (
                 <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div 
                      className="absolute bottom-full right-2 mb-2 bg-surface rounded-xl shadow-lg w-56 p-2 z-20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                        <button className="w-full text-left px-4 py-2.5 text-on-surface hover:bg-primary-container/50 rounded-lg text-base">
                            Mark as spam
                        </button>
                        <button className="w-full text-left px-4 py-2.5 text-on-surface hover:bg-primary-container/50 rounded-lg text-base">
                            Flag
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};