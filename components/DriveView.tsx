import React from 'react';
import { FolderIcon } from './icons';

export const DriveView: React.FC = () => {
    return (
        <div className="flex-grow bg-bg text-on-surface flex flex-col overflow-hidden">
            <header className="flex items-center p-4 shrink-0 border-b border-outline">
                <h1 className="text-xl font-bold text-on-surface">My Drive</h1>
            </header>
            <main className="flex-grow flex flex-col justify-center items-center text-center p-4">
                <FolderIcon className="h-16 w-16 text-on-surface-variant mb-4" />
                <h2 className="text-xl font-medium text-on-surface">Your files in one place</h2>
                <p className="text-on-surface-variant mt-1 max-w-xs">
                    Attachments from your emails and other files will be available here soon.
                </p>
            </main>
        </div>
    );
};