import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AppContext } from '../context/AppContext';
import { ActiveFilters } from '../types';

const FilterCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-4 py-3 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
        <div className="w-5 h-5 border-2 border-on-surface-variant/70 rounded-sm flex items-center justify-center flex-shrink-0">
            {checked && <div className="w-3 h-3 bg-on-surface-variant/70 rounded-sm" />}
        </div>
        <span className="text-on-surface text-base">{label}</span>
    </label>
);

const GENERAL_FILTERS: { key: keyof ActiveFilters, label: string }[] = [
    { key: 'unread', label: 'Unread' },
    { key: 'starred', label: 'Starred' },
    { key: 'attachments', label: 'Attachments' },
    { key: 'unanswered', label: 'Unanswered' },
    { key: 'favorites', label: 'Favorites' },
];

const GMAIL_FILTERS: { key: keyof ActiveFilters, label: string }[] = [
    { key: 'personal', label: 'Personal' },
    { key: 'social', label: 'Social' },
    { key: 'updates', label: 'Updates' },
    { key: 'forums', label: 'Forums' },
];


export const FilterModal: React.FC = () => {
    const { isFilterModalOpen, setIsFilterModalOpen, activeFilters, setActiveFilters } = useContext(AppContext);
    const [tempFilters, setTempFilters] = useState<ActiveFilters>(activeFilters);
    
    useEffect(() => {
        if(isFilterModalOpen) {
            setTempFilters(activeFilters);
        }
    }, [isFilterModalOpen, activeFilters]);

    if (!isFilterModalOpen) return null;

    const handleToggle = (filter: keyof ActiveFilters) => {
        setTempFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
    };

    const handleDone = () => {
        setActiveFilters(tempFilters);
        setIsFilterModalOpen(false);
    };

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
        >
            <div
                className="fixed inset-0"
                onClick={() => setIsFilterModalOpen(false)}
                aria-hidden="true"
            />
            <div
                className="relative bg-surface rounded-2xl shadow-xl w-full max-w-sm flex flex-col"
            >
                <div className="p-6">
                    <h2 id="filter-modal-title" className="text-2xl font-bold text-on-surface mb-4">
                        Filtered By:
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-on-surface-variant font-semibold mb-2">General</h3>
                            {GENERAL_FILTERS.map(filter => (
                                <FilterCheckbox 
                                    key={filter.key}
                                    label={filter.label}
                                    checked={tempFilters[filter.key]}
                                    onChange={() => handleToggle(filter.key)}
                                />
                            ))}
                        </div>
                        <div>
                            <h3 className="text-on-surface-variant font-semibold mb-2">Gmail</h3>
                             {GMAIL_FILTERS.map(filter => (
                                <FilterCheckbox 
                                    key={filter.key}
                                    label={filter.label}
                                    checked={tempFilters[filter.key]}
                                    onChange={() => handleToggle(filter.key)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-4">
                     <button
                        onClick={handleDone}
                        className="px-6 py-2 rounded-full text-lg font-semibold text-on-surface-variant hover:bg-on-surface/10 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};