import React, { useState, useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { AppContext } from '../context/AppContext';
import { Folder } from '../types';
import { FolderIcon, CheckIcon } from './icons';

const FOLDER_COLORS = [
    '#6c757d', // Gray
    '#dc3545', // Red
    '#fd7e14', // Orange
    '#ffc107', // Yellow
    '#198754', // Green
    '#0dcaf0', // Teal
    '#0d6efd', // Blue
    '#6f42c1', // Indigo
];
const FOLDER_NAME_MAX_LENGTH = 20;

export const AddFolderModal: React.FC = () => {
    const { 
        isAddFolderModalOpen, 
        setIsAddFolderModalOpen,
        folders,
        setFolders
    } = useContext(AppContext);

    const [folderName, setFolderName] = useState('');
    const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAddFolderModalOpen) {
            // Reset state on open
            setFolderName('');
            setSelectedColor(FOLDER_COLORS[0]);
            // Autofocus input
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isAddFolderModalOpen]);

    const handleClose = () => {
        setIsAddFolderModalOpen(false);
    };

    const handleSave = () => {
        if (!folderName.trim()) return;

        const newFolder: Folder = {
            id: `folder_${Date.now()}`,
            name: folderName.trim(),
            icon: FolderIcon,
            color: selectedColor,
        };

        setFolders(prevFolders => [...prevFolders, newFolder]);
        handleClose();
    };

    if (!isAddFolderModalOpen) {
        return null;
    }

    const isSaveDisabled = folderName.trim().length === 0;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-folder-title"
        >
            <div
                className="fixed inset-0 bg-black/40 transition-opacity"
                onClick={handleClose}
                aria-hidden="true"
            />
            
            <div
                className="relative bg-surface rounded-2xl shadow-xl w-full max-w-sm"
            >
                <div className="p-6">
                    <h2 id="add-folder-title" className="text-xl font-semibold text-on-surface mb-6">
                       New folder
                    </h2>
                    
                    {/* Floating Label Input */}
                    <div className="relative mb-6">
                        <input
                            ref={inputRef}
                            type="text"
                            id="folderName"
                            className="block px-2.5 pb-2.5 pt-4 w-full text-base text-on-surface bg-transparent rounded-lg border-2 border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                            placeholder=" "
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            maxLength={FOLDER_NAME_MAX_LENGTH}
                        />
                        <label
                            htmlFor="folderName"
                            className="absolute text-base text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                        >
                            Folder name
                        </label>
                         <span className="absolute bottom-2 right-2 text-xs text-on-surface-variant">
                            {folderName.length} / {FOLDER_NAME_MAX_LENGTH}
                        </span>
                    </div>

                    {/* Color Picker */}
                    <div>
                        <p className="text-sm font-medium text-on-surface-variant mb-3">Folder color</p>
                        <div className="flex justify-between">
                            {FOLDER_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform transform hover:scale-110"
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                >
                                    {selectedColor === color && (
                                        <CheckIcon className="w-5 h-5 text-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 p-4 pt-0">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 rounded-full text-sm font-semibold text-on-surface-variant hover:bg-on-surface/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        className="px-6 py-2 rounded-full text-sm font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};