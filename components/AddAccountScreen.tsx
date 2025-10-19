import React from 'react';
import {
    ArrowLeftIcon,
    GoogleIcon,
    YahooIcon,
    OutlookIcon,
    ExchangeIcon,
    Office365Icon,
    EnvelopeIcon
} from './icons';
import { IconButton } from './ui/IconButton';

interface AddAccountScreenProps {
    onBack: () => void;
}

const providers = [
    { name: 'Google', icon: GoogleIcon, customClass: "h-full w-full" },
    { name: 'Yahoo', icon: YahooIcon, customClass: "h-12 w-12" },
    { name: 'Hotmail\nOutlook', icon: OutlookIcon, customClass: "h-12 w-12" },
    { name: 'Exchange', icon: ExchangeIcon, customClass: "h-12 w-12" },
    { name: 'Office365', icon: Office365Icon, customClass: "h-10 w-10" },
    { name: 'Other', icon: EnvelopeIcon, customClass: "h-10 w-10 text-on-surface-variant" },
];

const ProviderButton: React.FC<{ name: string; icon: React.ElementType; customClass?: string; }> = ({ name, icon: Icon, customClass }) => {
    const isMultiLine = name.includes('\n');
    return (
        <button
            onClick={() => alert(`Set up for ${name.replace('\n', ' ')}`)}
            className="flex flex-col items-center justify-start h-32"
            aria-label={`Set up ${name.replace('\n', ' ')} account`}
        >
            <div className="w-20 h-20 bg-surface rounded-2xl shadow-sm flex items-center justify-center p-3 mb-2 flex-shrink-0">
                <Icon className={customClass} />
            </div>
            <span className={`text-xs text-on-surface-variant text-center ${isMultiLine ? 'leading-tight' : ''}`} style={{ whiteSpace: 'pre-wrap' }}>
                {name}
            </span>
        </button>
    );
};

export const AddAccountScreen: React.FC<AddAccountScreenProps> = ({ onBack }) => {
    return (
        <div className="bg-bg h-full flex flex-col relative">
            {/* The back button is a functional requirement from the user prompt */}
            <header className="absolute top-0 left-0 p-2 z-10">
                 <IconButton label="Back to settings" onClick={onBack}>
                    <ArrowLeftIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
            </header>
            
            <main className="flex-grow overflow-y-auto px-8 pb-8 flex flex-col justify-center">
                 <div className="w-full max-w-sm mx-auto">
                    <h1 className="text-4xl font-bold text-on-surface mb-16">
                        Set up Email
                    </h1>

                    <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                        {providers.map(provider => (
                            <ProviderButton key={provider.name} name={provider.name} icon={provider.icon} customClass={provider.customClass} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
