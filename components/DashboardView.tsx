import React from 'react';
import { IconButton } from './ui/IconButton';
import { 
    ArrowLeftIcon,
    CheckSquareIcon,
    CheckVIcon,
    HandThumbDownIcon,
    HeartIcon
} from './icons';

interface DashboardViewProps {
  onBack: () => void;
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex justify-between items-center px-2 mt-6 mb-3">
        <h3 className="font-semibold text-on-surface">{title}</h3>
        <button className="text-sm font-semibold text-accent">See All</button>
    </div>
);

// Mock Data
const newsletters = [
    { id: 1, sender: 'WorldPosta Sales Team', detail: 'notific...', iconUrl: 'https://logo.clearbit.com/worldposta.com' },
    { id: 2, sender: 'ClickUp Support', detail: 'support@clic...', iconUrl: 'https://logo.clearbit.com/clickup.com' },
    { id: 3, sender: 'Amazon Web Services', detail: 'aws-m...', iconUrl: 'https://logo.clearbit.com/aws.amazon.com' },
];

const topContacts = [
    { id: 1, name: 'Ahmed Ali', email: 'aali@roaya.co', avatarUrl: 'https://ui-avatars.com/api/?name=Ahmed+Ali&background=2196F3&color=fff' },
    { id: 2, name: 'Ola Aldaoshy', email: 'o.aldaoshy@roa...', avatarUrl: 'https://ui-avatars.com/api/?name=Ola+Aldaoshy&background=4CAF50&color=fff' },
];


export const DashboardView: React.FC<DashboardViewProps> = ({ onBack }) => {
    const progress = 22;

    return (
        <div className="flex-grow bg-bg text-on-surface flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex items-center p-4 shrink-0 border-b border-outline">
                <IconButton label="Back to AI chat" onClick={onBack} className="-ml-2">
                    <ArrowLeftIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
                <h2 className="text-xl font-bold text-on-surface flex-grow text-center">Dashboard</h2>
                <div className="w-10"></div> {/* Spacer to balance the header */}
            </header>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto p-4 space-y-2">
                {/* App Progress */}
                <div className="mb-4">
                    <div className="flex items-center justify-between px-2 py-1">
                        <div className="flex items-center">
                            <CheckSquareIcon className="h-5 w-5 text-on-surface mr-2" />
                            <p className="font-semibold text-on-surface">App Progress</p>
                        </div>
                        <span className="font-semibold text-on-surface-variant">{progress}%</span>
                    </div>
                    <div className="h-1 bg-primary-container rounded-full mt-2 mx-2">
                        <div className="h-1 bg-on-surface rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Read Receipts */}
                <div>
                    <SectionHeader title="Read Receipts" />
                    <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md">
                        <CheckVIcon className="h-6 w-6 mb-2" />
                        <h4 className="text-lg font-bold">Send an email via Canary</h4>
                        <p className="text-sm opacity-90 mt-1">
                            Once it is read, you will see it here (must have Read Receipts enabled).
                        </p>
                    </div>
                </div>

                {/* Newsletters */}
                <div>
                    <SectionHeader title="Newsletters" />
                    <div className="bg-surface rounded-xl shadow-sm">
                        {newsletters.map((item, index) => (
                            <div key={item.id} className={`flex items-center p-3 ${index > 0 ? 'border-t border-outline' : ''}`}>
                                <img src={item.iconUrl} alt={`${item.sender} logo`} className="w-8 h-8 rounded-full mr-3 bg-gray-200" />
                                <div className="flex-grow truncate">
                                    <p className="font-medium text-on-surface truncate">{item.sender}</p>
                                    <p className="text-sm text-on-surface-variant truncate">{item.detail}</p>
                                </div>
                                <IconButton label="Unsubscribe">
                                    <HandThumbDownIcon className="h-5 w-5 text-on-surface-variant" />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Top Contacts */}
                <div>
                    <SectionHeader title="Top Contacts" />
                     <div className="bg-surface rounded-xl shadow-sm">
                        {topContacts.map((contact, index) => (
                             <div key={contact.id} className={`flex items-center p-3 ${index > 0 ? 'border-t border-outline' : ''}`}>
                                <img src={contact.avatarUrl} alt={`${contact.name} avatar`} className="w-8 h-8 rounded-full mr-3" />
                                <div className="flex-grow truncate">
                                    <p className="font-medium text-on-surface truncate">{contact.name}</p>
                                    <p className="text-sm text-on-surface-variant truncate">{contact.email}</p>
                                </div>
                                <IconButton label="Add to favorites">
                                    <HeartIcon className="h-5 w-5 text-blue-500" />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};