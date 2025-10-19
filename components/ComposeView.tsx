
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { XMarkIcon, PaperAirplaneIcon, PaperClipIcon } from './icons';

export const ComposeView: React.FC = () => {
    const { setIsComposing } = useContext(AppContext);

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-outline/20 bg-surface-alt rounded-t-2xl">
                    <h2 className="text-lg font-semibold text-on-surface">New Message</h2>
                    <button
                        onClick={() => setIsComposing(false)}
                        className="p-2 rounded-full hover:bg-on-surface/10 text-on-surface-variant"
                        aria-label="Close compose"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="border-b border-outline/20 pb-2">
                        <input type="email" placeholder="To" className="w-full bg-transparent outline-none py-2 text-on-surface" />
                    </div>
                     <div className="border-b border-outline/20 pb-2">
                        <input type="email" placeholder="Cc/Bcc" className="w-full bg-transparent outline-none py-2 text-on-surface" />
                    </div>
                    <div className="border-b border-outline/20 pb-2">
                        <input type="text" placeholder="Subject" className="w-full bg-transparent outline-none py-2 text-on-surface" />
                    </div>
                    <div className="flex-grow py-2">
                        <textarea
                            placeholder="Compose email"
                            className="w-full h-full bg-transparent outline-none resize-none text-on-surface"
                        />
                    </div>
                </div>
                <footer className="flex items-center justify-between p-4 border-t border-outline/20">
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                            <PaperAirplaneIcon className="h-5 w-5" />
                            <span>Send</span>
                        </button>
                         <button className="p-2 rounded-full hover:bg-on-surface/10 text-on-surface-variant" aria-label="Attach files">
                            <PaperClipIcon className="h-6 w-6" />
                        </button>
                    </div>
                     <button
                        onClick={() => setIsComposing(false)}
                        className="text-sm font-semibold text-error hover:bg-error/10 px-3 py-2 rounded-full"
                    >
                        Discard
                    </button>
                </footer>
            </div>
        </div>
    );
};
