import React, { useState } from 'react';
import {
    ArrowLeftIcon,
    GoogleIcon,
    ZohoIcon,
    ExchangeIcon,
    Office365Icon,
    EnvelopeIcon
} from './icons';
import { IconButton } from './ui/IconButton';

interface AddAccountScreenProps {
    onBack: () => void;
}

const providers = [
    { name: 'Google', icon: GoogleIcon, customClass: "h-6 w-6" },
    { name: 'Zoho', icon: ZohoIcon, customClass: "h-7 w-7" },
    { name: 'Exchange', icon: ExchangeIcon, customClass: "h-7 w-7" },
    { name: 'Office365', icon: Office365Icon, customClass: "h-6 w-6" },
    { name: 'Other', icon: EnvelopeIcon, customClass: "h-6 w-6 text-on-surface-variant" },
];

const ProviderIcon: React.FC<{ name: string; icon: React.ElementType; customClass?: string; }> = ({ name, icon: Icon, customClass }) => {
    return (
        <button
            onClick={() => alert(`Set up for ${name}`)}
            className="w-12 h-12 bg-surface rounded-lg shadow-sm flex items-center justify-center p-2 hover:bg-surface-alt transition-colors"
            aria-label={`Set up ${name} account`}
        >
            <Icon className={customClass} />
        </button>
    );
};

const CustomCheckbox: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => {
    return (
        <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className="w-6 h-6 rounded-full border-2 border-on-surface-variant/50 flex-shrink-0 flex items-center justify-center mr-3">
                {checked && <div className="w-3 h-3 bg-primary rounded-full" />}
            </div>
            <span className="text-on-surface">{label}</span>
        </label>
    );
};

export const AddAccountScreen: React.FC<AddAccountScreenProps> = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isDefault, setIsDefault] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Signing in with ${email}`);
    };

    return (
        <div className="bg-bg h-full flex flex-col">
            <header className="flex items-center p-4 shrink-0">
                <IconButton label="Back" onClick={onBack} className="-ml-2">
                    <ArrowLeftIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
            </header>
            
            <main className="flex-grow overflow-y-auto px-4">
                <div className="w-full max-w-sm mx-auto">
                    <h1 className="text-5xl font-bold text-center text-on-surface mb-8">Posta</h1>

                    <div className="bg-surface rounded-3xl p-8 shadow-sm">
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Email Input */}
                            <div className="relative mb-6">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block px-0 pb-2 w-full text-base text-on-surface bg-transparent border-0 border-b border-on-surface-variant/50 appearance-none focus:outline-none focus:ring-0 focus:border-b-2 focus:border-primary peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute text-base text-on-surface-variant duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Email address
                                </label>
                            </div>

                            {/* Password Input */}
                            <div className="relative mb-8">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block px-0 pb-2 w-full text-base text-on-surface bg-transparent border-0 border-b border-on-surface-variant/50 appearance-none focus:outline-none focus:ring-0 focus:border-b-2 focus:border-primary peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute text-base text-on-surface-variant duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Password
                                </label>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-4 mb-8">
                                <CustomCheckbox
                                    label="Show password"
                                    checked={showPassword}
                                    onChange={setShowPassword}
                                />
                                <CustomCheckbox
                                    label="Set as default email"
                                    checked={isDefault}
                                    onChange={setIsDefault}
                                />
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                className="w-full bg-primary text-on-primary font-semibold py-3 rounded-full text-lg hover:opacity-90 transition-opacity"
                            >
                                Sign in
                            </button>
                        </form>
                    </div>


                    {/* Other Providers */}
                    <div className="mt-10">
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-outline"></div>
                            <span className="flex-shrink mx-4 text-on-surface-variant text-sm">Or use a provider</span>
                            <div className="flex-grow border-t border-outline"></div>
                        </div>
                        <div className="mt-6 flex justify-center gap-4">
                            {providers.map(provider => (
                                <ProviderIcon key={provider.name} name={provider.name} icon={provider.icon} customClass={provider.customClass} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};