import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
    XMarkIcon, 
    PaperClipIcon, 
    PaperAirplaneIcon, 
    EllipsisVerticalIcon, 
    CheckVIcon,
    EditIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    CameraIcon,
    ClockIcon,
    ChevronDownIcon,
    SparklesIcon,
} from './icons';
import { IconButton } from './ui/IconButton';
import { DropdownMenu, DropdownMenuItem } from './ui/Dropdown';
import { ScheduleSendModal } from './ScheduleSendModal';
import { GoogleGenAI } from '@google/genai';


const RichTextToolbar: React.FC = () => (
    <div className="bg-surface border-t border-outline flex items-center justify-between px-4 py-2 shrink-0">
        <div className="flex items-center space-x-4">
            <IconButton label="Formatting options"><EditIcon className="w-6 h-6 text-on-surface-variant" /></IconButton>
            <IconButton label="Undo"><ArrowUturnLeftIcon className="w-6 h-6 text-on-surface-variant" /></IconButton>
            <IconButton label="Redo"><ArrowUturnRightIcon className="w-6 h-6 text-on-surface-variant" /></IconButton>
            <IconButton label="Add image"><CameraIcon className="w-6 h-6 text-on-surface-variant" /></IconButton>
        </div>
        <div className="flex items-center space-x-2 text-on-surface-variant text-sm font-medium">
            <span>Roboto...</span>
            <ChevronDownIcon className="w-4 h-4" />
            <span>12</span>
            <ChevronDownIcon className="w-4 h-4" />
            <span className="font-bold">B</span>
        </div>
    </div>
);


export const ReplyView: React.FC = () => {
    const {
        isReplying,
        setIsReplying,
        replyingToMessage,
        setReplyingToMessage,
        setReplyType,
    } = useContext(AppContext);

    const [includePreviousMessages, setIncludePreviousMessages] = useState(true);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    
    const [replyBody, setReplyBody] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleClose = () => {
        setIsReplying(false);
        setReplyingToMessage(null);
        setReplyType(null);
        setReplyBody('');
    };

    const handleScheduleSendClick = () => {
        setIsMoreMenuOpen(false);
        setIsScheduleModalOpen(true);
    };

    const handleGenerateReply = async () => {
        if (!replyingToMessage || isGenerating) return;

        setIsGenerating(true);
        setReplyBody('Generating reply with AI...');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            const plainTextBody = replyingToMessage.body.replace(/<[^>]*>?/gm, ' ').trim();

            const prompt = `Based on the following email, write a short, professional reply:
            
            From: ${replyingToMessage.sender.name}
            Subject: ${replyingToMessage.subject}
            
            --- Email Content ---
            ${plainTextBody}
            ---
            
            Draft a reply:`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setReplyBody(response.text);
        } catch (error) {
            console.error("Error generating AI reply:", error);
            setReplyBody("Sorry, I couldn't generate a reply. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };


    if (!isReplying || !replyingToMessage) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-surface z-50 flex flex-col animate-slide-up">
            {/* Header */}
            <header className="flex items-center p-2 border-b border-outline shrink-0">
                <IconButton label="Close" onClick={handleClose}>
                    <XMarkIcon className="w-6 h-6" />
                </IconButton>
                <div className="flex-grow" />
                <IconButton label="Generate AI reply" onClick={handleGenerateReply} disabled={isGenerating}>
                    <SparklesIcon className={`w-6 h-6 ${isGenerating ? 'animate-pulse text-accent' : 'text-on-surface-variant'}`} />
                </IconButton>
                <IconButton label="Attach file"><PaperClipIcon className="w-6 h-6" /></IconButton>
                <IconButton label="Schedule send" onClick={handleScheduleSendClick}><ClockIcon className="w-6 h-6" /></IconButton>
                <IconButton label="Send"><PaperAirplaneIcon className="w-6 h-6" /></IconButton>
                <div className="relative">
                    <IconButton label="More options" onClick={() => setIsMoreMenuOpen(o => !o)}>
                        <EllipsisVerticalIcon className="w-6 h-6" />
                    </IconButton>
                    <DropdownMenu
                        isOpen={isMoreMenuOpen}
                        onClose={() => setIsMoreMenuOpen(false)}
                        position="right"
                        className="!w-56"
                    >
                        <DropdownMenuItem onClick={() => alert('Save in Drafts clicked')}>Save in Drafts</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert('Priority clicked')}>Priority</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert('Security options clicked')}>Security options</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert('Turn off Rich text clicked')}>Turn off Rich text</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert('Permission clicked')}>Permission</DropdownMenuItem>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-grow overflow-y-auto px-4">
                {/* Compose Area */}
                <div className="py-2">
                    <textarea
                        placeholder="Write email"
                        className="w-full h-24 bg-transparent outline-none resize-none text-on-surface"
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                    />
                </div>

                {/* Include Previous Toggle */}
                 <div className="py-3 flex items-center">
                    <button 
                        onClick={() => setIncludePreviousMessages(v => !v)}
                        className="flex items-center"
                    >
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0 transition-colors ${includePreviousMessages ? 'bg-accent' : 'bg-gray-200'}`}>
                            {includePreviousMessages && <CheckVIcon className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-on-surface font-medium">Include previous messages</span>
                    </button>
                </div>

                {/* Quoted Message */}
                {includePreviousMessages && (
                    <div className="py-3 text-sm text-on-surface-variant border-t border-outline/70 mt-2">
                        <p>------ Original message ------</p>
                        <p>From: {replyingToMessage.sender.name} &lt;{replyingToMessage.sender.email}&gt;</p>
                        <p>Date: {replyingToMessage.timestamp.toLocaleString()}</p>
                        <p>To: {replyingToMessage.recipients.to.join(', ')}</p>
                        <p>Subject: {replyingToMessage.subject}</p>
                        <br />
                        <div className="prose prose-sm max-w-none text-on-surface" dangerouslySetInnerHTML={{ __html: replyingToMessage.body }} />
                    </div>
                )}
            </div>
            
            <RichTextToolbar />
            <ScheduleSendModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
            />
        </div>
    );
};