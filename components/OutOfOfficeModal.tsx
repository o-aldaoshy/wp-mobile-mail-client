
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ArrowLeftIcon } from './icons';
import { IconButton } from './ui/IconButton';

interface OutOfOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Re-usable local components to match the specific UI of this screen

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`${
        checked ? 'bg-accent' : 'bg-gray-300'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
    >
      <span
        className={`${
          checked ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

const SettingsSection: React.FC<{ title: string, className?: string }> = ({ title, className }) => (
  <h3 className={`px-1 text-xs font-bold text-on-surface-variant uppercase tracking-wider ${className}`}>{title}</h3>
);

const SettingsCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-surface rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

const RadioButton: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
    <div onClick={onClick} className="flex items-center cursor-pointer py-2">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors`} style={{ borderColor: '#adb5bd' }}>
            {isSelected && <div className="w-3 h-3 rounded-full bg-on-surface" />}
        </div>
        <span className="font-medium text-on-surface">{label}</span>
    </div>
);


export const OutOfOfficeModal: React.FC<OutOfOfficeModalProps> = ({ isOpen, onClose }) => {
    const [isOn, setIsOn] = useState(true);
    const [isPeriodEnabled, setIsPeriodEnabled] = useState(true);
    const [sendToExternal, setSendToExternal] = useState(true);
    const [replyToContactsOnly, setReplyToContactsOnly] = useState(false);

    if (!isOpen) {
        return null;
    }
  
    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-bg z-[51] flex flex-col transition-transform duration-300 ease-in-out"
            aria-modal="true"
            role="dialog"
        >
            <header className="bg-surface flex items-center p-4 border-b border-outline shrink-0">
                <IconButton label="Back" onClick={onClose} className="-ml-2">
                <ArrowLeftIcon className="h-6 w-6 text-on-surface" />
                </IconButton>
                <h2 className="text-xl font-bold text-on-surface flex-grow text-center">Out of office reply</h2>
                <div className="w-10"></div> 
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <SettingsCard>
                    <div className="flex items-center justify-between px-4 py-3">
                        <p className={`font-medium ${isOn ? 'text-accent' : 'text-on-surface'}`}>On</p>
                        <ToggleSwitch checked={isOn} onChange={setIsOn} label="Out of office reply" />
                    </div>
                </SettingsCard>

                <div className="space-y-2">
                    <SettingsSection title="Time Period" />
                    <SettingsCard className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-on-surface">Out of office period</p>
                            <ToggleSwitch checked={isPeriodEnabled} onChange={setIsPeriodEnabled} label="Out of office period" />
                        </div>
                        <div>
                            <p className="text-sm text-on-surface-variant mb-2">Start date/time</p>
                            <div className="flex space-x-2">
                                <button className="bg-gray-200 text-on-surface font-medium rounded-full px-5 py-2">14 Oct, 2025</button>
                                <button className="bg-gray-200 text-on-surface font-medium rounded-full px-5 py-2">15:00</button>
                            </div>
                        </div>
                         <div>
                            <p className="text-sm text-on-surface-variant mb-2">End date/time</p>
                            <div className="flex space-x-2">
                                <button className="bg-gray-200 text-on-surface font-medium rounded-full px-5 py-2">15 Oct, 2025</button>
                                <button className="bg-gray-200 text-on-surface font-medium rounded-full px-5 py-2">15:00</button>
                            </div>
                        </div>
                    </SettingsCard>
                </div>

                 <div className="space-y-2">
                    <SettingsSection title="Message" />
                    <SettingsCard className="p-4 space-y-6">
                         <input type="text" placeholder="Enter message" className="w-full bg-transparent border-b border-outline outline-none py-2 text-on-surface placeholder:text-on-surface-variant" />
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-on-surface">Send out of office replies to external senders.</p>
                            <ToggleSwitch checked={sendToExternal} onChange={setSendToExternal} label="Send to external senders" />
                        </div>
                        <input type="text" placeholder="External message" className="w-full bg-transparent border-b border-outline outline-none py-2 text-on-surface placeholder:text-on-surface-variant" />
                        <RadioButton 
                            label="Send reply only to senders in Contacts"
                            isSelected={replyToContactsOnly}
                            onClick={() => setReplyToContactsOnly(prev => !prev)}
                        />
                    </SettingsCard>
                </div>
            </main>

            <footer className="bg-surface p-4 flex justify-center space-x-4 border-t border-outline shrink-0">
                <button onClick={onClose} className="px-12 py-2 text-lg font-semibold text-on-surface-variant">Cancel</button>
                <button onClick={onClose} className="px-12 py-2 text-lg font-semibold text-on-surface-variant">Done</button>
            </footer>

        </div>,
        document.body
    );
};
