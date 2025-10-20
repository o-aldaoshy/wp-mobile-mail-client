import React from 'react';
import { DriveFile } from '../types';
import { 
    XMarkIcon, 
    ArrowDownTrayIcon, 
    PrinterIcon,
    FolderIcon, 
    PhotoIcon, 
    DocumentTextIcon, 
    VideoCameraIcon 
} from './icons';

const PreviewFileIcon: React.FC<{ type: DriveFile['type'], className?: string }> = ({ type, className = "h-8 w-8" }) => {
    switch (type) {
        case 'folder': return <FolderIcon className={`${className} text-on-surface-variant`} />;
        case 'image': return <PhotoIcon className={`${className} text-purple-500`} />;
        case 'pdf': return <DocumentTextIcon className={`${className} text-red-500`} />;
        case 'video': return <VideoCameraIcon className={`${className} text-orange-500`} />;
        case 'doc': return <DocumentTextIcon className={`${className} text-sky-500`} />;
        default: return <DocumentTextIcon className={`${className} text-on-surface-variant`} />;
    }
};

interface FilePreviewProps {
    file: DriveFile | null;
    onClose: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
    if (!file) return null;

    const renderPreviewContent = () => {
        switch (file.type) {
            case 'image':
                return (
                    <div className="flex justify-center items-center h-full w-full p-4">
                        <img 
                            src={file.thumbnailUrl || 'https://picsum.photos/800/600'} 
                            alt={`Preview of ${file.name}`}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        />
                    </div>
                );
            case 'pdf':
            case 'doc':
                return (
                    <div className="flex flex-col justify-center items-center h-full w-full bg-surface-alt rounded-b-2xl">
                        <PreviewFileIcon type={file.type} className="h-32 w-32" />
                        <p className="mt-4 text-xl font-medium text-on-surface">{file.name}</p>
                        <p className="mt-2 text-on-surface-variant">Preview not available for this file type.</p>
                    </div>
                );
            default:
                return (
                     <div className="flex flex-col justify-center items-center h-full w-full bg-surface-alt rounded-b-2xl">
                        <PreviewFileIcon type={file.type} className="h-32 w-32" />
                        <p className="mt-4 text-xl font-medium text-on-surface">{file.name}</p>
                        <p className="mt-2 text-on-surface-variant">No preview available.</p>
                    </div>
                );
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center p-2 pr-4 border-b border-outline shrink-0">
                    <div className="flex items-center flex-grow truncate">
                         <PreviewFileIcon type={file.type} className="h-8 w-8 mx-2 flex-shrink-0" />
                        <span className="font-semibold text-on-surface truncate">{file.name}</span>
                    </div>
                    <div className="flex items-center shrink-0">
                        <button className="p-2 rounded-full hover:bg-on-surface/10 text-on-surface-variant" aria-label="Download file">
                            <ArrowDownTrayIcon className="h-6 w-6" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-on-surface/10 text-on-surface-variant" aria-label="Print file">
                            <PrinterIcon className="h-6 w-6" />
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-on-surface/10 text-on-surface-variant" aria-label="Close preview">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </header>
                <main className="flex-grow overflow-auto">
                    {renderPreviewContent()}
                </main>
            </div>
        </div>
    );
};