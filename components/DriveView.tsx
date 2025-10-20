import React, { useState, useRef } from 'react';
import {
    SearchIcon, EllipsisVerticalIcon, FolderIcon, PhotoIcon,
    DocumentTextIcon, VideoCameraIcon, EllipsisHorizontalIcon, PlusIcon,
    StarIcon, ClockIcon, TrashIcon, UsersIcon, ComputerDesktopIcon,
    MenuIcon, CloudArrowUpIcon, FolderPlusIcon, FolderArrowUpIcon,
    DocumentIcon, TableCellsIcon, PresentationChartIcon
} from './icons';
import { IconButton } from './ui/IconButton';
import { DropdownMenu, DropdownMenuItem } from './ui/Dropdown';
import { DriveFile } from '../types';
import { FilePreview } from './FilePreview';

const INITIAL_DRIVE_FILES: DriveFile[] = [
    { id: 'df1', name: 'Q3 Report.pdf', type: 'pdf', size: '1.2 MB', modifiedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: 'df2', name: 'Project Alpha', type: 'folder', itemCount: 12, modifiedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'df3', name: 'Team Offsite.jpg', type: 'image', size: '4.5 MB', modifiedDate: new Date(Date.now() - 15 * 60 * 1000), thumbnailUrl: 'https://picsum.photos/seed/offsite/800/600' },
    { id: 'df4', name: 'Invoices', type: 'folder', itemCount: 5, modifiedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: 'df5', name: 'Onboarding.docx', type: 'doc', size: '256 KB', modifiedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: 'df6', name: 'Marketing Video.mp4', type: 'video', size: '128 MB', modifiedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: 'df7', name: 'Logo variations.png', type: 'image', size: '1.8 MB', modifiedDate: new Date(Date.now() - 60 * 60 * 1000), thumbnailUrl: 'https://picsum.photos/seed/logo/800/600' },
];

interface DriveSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    folderInputRef: React.RefObject<HTMLInputElement>;
}

// Sidebar Navigation Item Component
const NavItem: React.FC<{ icon: React.ElementType; label: string; isActive?: boolean, onClick: () => void; }> = ({ icon: Icon, label, isActive, onClick }) => {
    return (
        <button onClick={onClick} className={`w-full flex items-center px-4 py-2 text-left rounded-r-full transition-colors ${isActive ? 'bg-primary-container text-primary font-semibold' : 'text-on-surface-variant hover:bg-surface'}`}>
            <Icon className="h-6 w-6 mr-4" />
            <span>{label}</span>
        </button>
    );
};

// Sidebar Component
const DriveSidebar: React.FC<DriveSidebarProps> = ({ isOpen, onClose, fileInputRef, folderInputRef }) => {
    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
    
    const usedStorage = 10.5; // GB
    const totalStorage = 15; // GB
    const usedPercentage = (usedStorage / totalStorage) * 100;

    const handleNavItemClick = () => {
        // In a real app, this would navigate. For now, just close the drawer on mobile.
        onClose();
    };

    const handleMenuItemClick = (action: string) => {
        setIsNewMenuOpen(false);
        switch (action) {
            case 'file-upload':
                fileInputRef.current?.click();
                break;
            case 'folder-upload':
                folderInputRef.current?.click();
                break;
            default:
                alert(`${action} clicked`);
                break;
        }
    };

    return (
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-surface-alt p-2 pr-4 flex flex-col transform transition-transform ease-in-out duration-300 lg:relative lg:translate-x-0 lg:w-64 shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* New Button */}
            <div className="p-2 relative">
                <button 
                    onClick={() => setIsNewMenuOpen(o => !o)}
                    className="bg-surface rounded-2xl shadow-md w-auto flex items-center justify-center p-4 pr-6 hover:bg-outline/50 transition-colors"
                >
                    <PlusIcon className="h-6 w-6 mr-2" />
                    <span className="font-semibold text-on-surface">New</span>
                </button>
                <DropdownMenu 
                    isOpen={isNewMenuOpen} 
                    onClose={() => setIsNewMenuOpen(false)} 
                    className="!w-72 !left-0 !top-full mt-2" 
                    position="right"
                >
                    <DropdownMenuItem icon={<FolderPlusIcon className="h-6 w-6 text-on-surface-variant"/>} onClick={() => handleMenuItemClick('New folder')}>
                        New folder
                    </DropdownMenuItem>
                    <div className="my-2 border-t border-outline mx-2"></div>
                    <DropdownMenuItem icon={<CloudArrowUpIcon className="h-6 w-6 text-on-surface-variant"/>} onClick={() => handleMenuItemClick('file-upload')}>
                        File upload
                    </DropdownMenuItem>
                    <DropdownMenuItem icon={<FolderArrowUpIcon className="h-6 w-6 text-on-surface-variant"/>} onClick={() => handleMenuItemClick('folder-upload')}>
                        Folder upload
                    </DropdownMenuItem>
                    <div className="my-2 border-t border-outline mx-2"></div>
                    <DropdownMenuItem icon={<DocumentIcon className="h-6 w-6 text-blue-500"/>} onClick={() => handleMenuItemClick('Google Docs')}>
                        Google Docs
                    </DropdownMenuItem>
                    <DropdownMenuItem icon={<TableCellsIcon className="h-6 w-6 text-green-500"/>} onClick={() => handleMenuItemClick('Google Sheets')}>
                        Google Sheets
                    </DropdownMenuItem>
                    <DropdownMenuItem icon={<PresentationChartIcon className="h-6 w-6 text-yellow-500"/>} onClick={() => handleMenuItemClick('Google Slides')}>
                        Google Slides
                    </DropdownMenuItem>
                </DropdownMenu>
            </div>

            {/* Navigation */}
            <nav className="mt-4 flex-grow">
                <ul className="space-y-1">
                    <li><NavItem icon={FolderIcon} label="My Drive" isActive onClick={handleNavItemClick} /></li>
                    <li><NavItem icon={ComputerDesktopIcon} label="Computers" onClick={handleNavItemClick} /></li>
                    <li><NavItem icon={UsersIcon} label="Shared with me" onClick={handleNavItemClick} /></li>
                    <li><NavItem icon={ClockIcon} label="Recent" onClick={handleNavItemClick} /></li>
                    <li><NavItem icon={StarIcon} label="Starred" onClick={handleNavItemClick} /></li>
                    <li><NavItem icon={TrashIcon} label="Trash" onClick={handleNavItemClick} /></li>
                </ul>
            </nav>

            {/* Storage */}
            <div className="p-4">
                <p className="text-sm font-medium text-on-surface">Storage</p>
                <div className="w-full bg-outline rounded-full h-1 my-2">
                    <div className="bg-primary h-1 rounded-full" style={{ width: `${usedPercentage}%` }}></div>
                </div>
                <p className="text-xs text-on-surface-variant">{usedStorage} GB of {totalStorage} GB used</p>
            </div>
        </aside>
    );
};


const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const FileIcon: React.FC<{ type: DriveFile['type'], className?: string }> = ({ type, className = "h-6 w-6" }) => {
    switch (type) {
        case 'folder':
            return <FolderIcon className={`${className} text-on-surface-variant`} />;
        case 'image':
            return <PhotoIcon className={`${className} text-purple-500`} />;
        case 'pdf':
            return <DocumentTextIcon className={`${className} text-red-500`} />;
        case 'video':
            return <VideoCameraIcon className={`${className} text-orange-500`} />;
        case 'doc':
            return <DocumentTextIcon className={`${className} text-sky-500`} />;
        default:
            return <DocumentTextIcon className={`${className} text-on-surface-variant`} />;
    }
};

const SuggestedFileCard: React.FC<{ file: DriveFile }> = ({ file }) => {
    return (
        <div className="bg-surface rounded-2xl w-56 flex-shrink-0 flex flex-col shadow-sm border border-outline/50">
            <div className="p-3">
                <p className="text-sm font-medium text-on-surface truncate">{file.name}</p>
            </div>
            <div className="h-32 bg-surface-alt rounded-b-2xl flex items-center justify-center overflow-hidden">
                {file.type === 'image' && file.thumbnailUrl ? (
                    <img src={file.thumbnailUrl} alt={file.name} className="h-full w-full object-cover" />
                ) : (
                    <FileIcon type={file.type} className="h-12 w-12" />
                )}
            </div>
        </div>
    );
};

const DriveListItem: React.FC<{ item: DriveFile; onItemClick: (item: DriveFile) => void; }> = ({ item, onItemClick }) => (
    <button onClick={() => onItemClick(item)} className="w-full flex items-center px-4 py-2 text-left hover:bg-surface rounded-lg transition-colors border-b border-outline">
        <div className="flex items-center flex-1 truncate pr-4">
            <FileIcon type={item.type} className="h-6 w-6 mr-4 flex-shrink-0" />
            <span className="font-medium text-on-surface truncate">{item.name}</span>
        </div>
        <div className="w-48 text-on-surface-variant text-sm hidden md:block">{formatDate(item.modifiedDate)}</div>
        <div className="w-32 text-on-surface-variant text-sm hidden md:block">{item.size || '--'}</div>
        <IconButton label="More options" className="text-on-surface-variant ml-auto">
            <EllipsisHorizontalIcon className="h-5 w-5" />
        </IconButton>
    </button>
);


export const DriveView: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [driveItems, setDriveItems] = useState<DriveFile[]>(INITIAL_DRIVE_FILES);
    const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);
    
    const suggestedFiles = driveItems.filter(f => f.type !== 'folder').slice(0, 5);
    const allDriveItems = [...driveItems].sort((a,b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return 0;
    });

    const getFileType = (file: File): DriveFile['type'] => {
        const mimeType = file.type;
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType === 'application/pdf') return 'pdf';
        if (mimeType.startsWith('video/')) return 'video';
        return 'doc';
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // FIX: Explicitly type `file` as `File` to resolve TypeScript errors about properties on `unknown`.
        const newDriveFiles: DriveFile[] = Array.from(files).map((file: File) => ({
            id: `df_${Date.now()}_${Math.random()}`,
            name: file.name,
            type: getFileType(file),
            size: formatFileSize(file.size),
            modifiedDate: new Date(file.lastModified),
            thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        }));

        setDriveItems(prev => [...newDriveFiles, ...prev]);
        
        event.target.value = '';
    };

    const handleItemClick = (item: DriveFile) => {
        if (item.type !== 'folder') {
            setPreviewFile(item);
        } else {
            // In a real app, this would navigate into the folder.
            alert(`Navigating to folder: ${item.name}`);
        }
    };

    return (
        <div className="flex-grow bg-bg text-on-surface flex flex-row overflow-hidden">
             {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <DriveSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                fileInputRef={fileInputRef}
                folderInputRef={folderInputRef}
            />
            
            <input type="file" ref={fileInputRef} onChange={handleFilesSelected} multiple style={{ display: 'none' }} aria-hidden="true" />
            <input type="file" ref={folderInputRef} onChange={handleFilesSelected} {...{ webkitdirectory: "", directory: "" }} style={{ display: 'none' }} aria-hidden="true" />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between p-4 shrink-0 border-b border-outline">
                    <div className="flex items-center">
                         <IconButton onClick={() => setIsSidebarOpen(true)} label="Open Drive menu" className="lg:hidden mr-2 -ml-2">
                            <MenuIcon className="h-6 w-6" />
                        </IconButton>
                        <h1 className="text-xl font-bold text-on-surface">My Drive</h1>
                    </div>
                    <div className="flex items-center">
                        <IconButton label="Search drive"><SearchIcon className="h-6 w-6" /></IconButton>
                        <IconButton label="More options"><EllipsisVerticalIcon className="h-6 w-6" /></IconButton>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow overflow-y-auto">
                    {/* Suggested Files */}
                    <div className="p-4">
                        <h2 className="text-base font-semibold text-on-surface mb-3">Suggested</h2>
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {suggestedFiles.map(file => <SuggestedFileCard key={file.id} file={file} />)}
                        </div>
                    </div>

                    {/* Files & Folders List */}
                    <div className="px-4 mt-4">
                        {/* List Header */}
                        <div className="flex items-center px-4 py-2 text-left text-sm font-medium text-on-surface-variant border-b-2 border-outline">
                            <div className="flex-1">Name</div>
                            <div className="w-48 hidden md:block">Last modified</div>
                            <div className="w-32 hidden md:block">File size</div>
                            <div className="w-12"></div> {/* Spacer for options button */}
                        </div>

                        {/* List Items */}
                        <div>
                            {allDriveItems.map(item => <DriveListItem key={item.id} item={item} onItemClick={handleItemClick} />)}
                        </div>
                    </div>
                    <div className="h-10" /> {/* Spacer */}
                </main>
            </div>
            <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
        </div>
    );
};
