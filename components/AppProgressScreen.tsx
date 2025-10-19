import React from 'react';
import { IconButton } from './ui/IconButton';
import { 
    ArrowLeftIcon, 
    ChevronRightIcon, 
    CheckVIcon,
    HeartIcon,
    PinIcon,
    DocumentDuplicateIcon,
    UsersIcon,
    LockClosedIcon,
    Squares2x2Icon,
    BroomIcon,
    ListBulletIcon
} from './icons';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'green' | 'red' | 'orange' | 'blue';
}

const colorClasses = {
    green: 'bg-success',
    red: 'bg-error',
    orange: 'bg-accent',
    blue: 'bg-primary'
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color }) => (
    <div className={`p-4 rounded-xl text-white ${colorClasses[color]}`}>
        <div className="flex items-start justify-between">
            <div>
                <div className="flex items-center mb-2">
                    <Icon className="h-5 w-5 mr-3" />
                    <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <p className="text-sm opacity-90">{description}</p>
            </div>
            <ChevronRightIcon className="h-6 w-6 mt-1 flex-shrink-0" />
        </div>
    </div>
);

// FIX: Added 'as const' to infer the color property as a literal type, not a generic string.
const FEATURES = [
    {
        icon: CheckVIcon,
        title: 'Read Receipts',
        description: 'Get notified as soon as your emails are read.',
        color: 'green',
    },
    {
        icon: HeartIcon,
        title: 'Favorites',
        description: 'Get easy access to the people that matter the most. Never miss important emails.',
        color: 'red',
    },
    {
        icon: PinIcon,
        title: 'Pin Emails',
        description: 'Keep important emails at the top of your Inbox.',
        color: 'orange',
    },
    {
        icon: DocumentDuplicateIcon,
        title: 'Templates',
        description: 'Save frequently used drafts to reuse them with 1-tap.',
        color: 'blue',
    },
    {
        icon: UsersIcon,
        title: 'Contact Profiles',
        description: 'Access all your Contacts\' emails, files & even social media profiles in one place.',
        color: 'green',
    },
    {
        icon: LockClosedIcon,
        title: 'End-To-End Encryption',
        description: 'Encrypt emails seamlessly with Canary\'s zero-setup encryption, or via PGP.',
        color: 'red',
    },
    {
        icon: Squares2x2Icon,
        title: 'Dashboard',
        description: 'Get an overview of your Inbox with the most useful information accessible in one place.',
        color: 'blue',
    },
    {
        icon: BroomIcon,
        title: 'Bulk Cleaner',
        description: 'Automatically archive or delete less important email to reduce clutter in your Inbox.',
        color: 'green',
    },
    {
        icon: ListBulletIcon,
        title: 'Custom Thread Actions',
        description: 'Get quick access to the actions that best suit your workflow.',
        color: 'red',
    }
] as const;

export const AppProgressScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    return (
        <div className="bg-bg h-full flex flex-col">
            <header className="bg-surface flex items-center p-4 border-b border-outline shrink-0">
                <IconButton label="Back" onClick={onBack} className="-ml-2">
                    <ArrowLeftIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
                <div className="flex-grow text-center">
                    <h2 className="text-xl font-bold text-on-surface">App Progress</h2>
                </div>
                <span className="text-lg font-bold text-on-surface w-10 text-right pr-2">33%</span>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center">
                        <CheckVIcon className="h-5 w-5 text-on-surface mr-2"/>
                        <p className="font-semibold text-on-surface">Get the most out of Canary!</p>
                    </div>
                    <span className="font-semibold text-on-surface">33%</span>
                </div>
                
                <h3 className="px-2 text-sm font-semibold text-on-surface-variant">Try Now</h3>

                <div className="space-y-3">
                    {FEATURES.map(feature => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>

                <div className="px-2 py-4">
                     <button
                        onClick={onBack}
                        className="font-semibold text-on-surface hover:text-primary"
                     >
                        Done
                     </button>
                </div>
            </main>
        </div>
    );
};