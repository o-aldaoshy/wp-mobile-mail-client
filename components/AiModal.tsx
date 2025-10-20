import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import {
    Squares2x2Icon,
    EnvelopeIcon,
    ArrowUturnLeftIcon,
    HandThumbDownIcon,
    CheckVIcon,
    PaperAirplaneIcon,
} from './icons';
import { DashboardView } from './DashboardView';

// Define message type
interface Message {
    id: number;
    sender: 'user' | 'ai';
    text: string;
}

const SuggestionChip: React.FC<{ icon: React.ElementType, text: string, onClick: (text: string) => void }> = ({ icon: Icon, text, onClick }) => (
    <button onClick={() => onClick(text)} className="flex items-center space-x-3 bg-surface p-3 rounded-full text-on-surface w-fit shadow-sm hover:bg-surface-alt transition-colors">
        <Icon className="h-5 w-5 text-on-surface-variant" />
        <span className="font-medium">{text}</span>
    </button>
);

const UserMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-end">
        <div className="bg-primary text-on-primary p-3 rounded-2xl rounded-br-lg max-w-sm">
            <p className="whitespace-pre-wrap">{text}</p>
        </div>
    </div>
);

const AiMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-start">
        <div className="bg-primary-container p-3 rounded-2xl rounded-bl-lg text-on-surface w-fit max-w-sm">
            <p className="whitespace-pre-wrap">{text}</p>
        </div>
    </div>
);

const LoadingIndicator: React.FC = () => (
    <div className="flex justify-start">
        <div className="bg-primary-container p-3 rounded-2xl rounded-bl-lg text-on-surface w-fit">
            <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 bg-on-surface/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-on-surface/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-on-surface/50 rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
);

export const AiModal: React.FC = () => {
    const [view, setView] = useState<'chat' | 'dashboard'>('chat');
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'ai', text: 'Hi Asmaa, What would you like to do today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initialize Gemini Chat
    useEffect(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are a helpful email assistant called Copilot. Be friendly and concise.'
                }
            });
            setChat(chatSession);
        } catch (error) {
            console.error("Failed to initialize Gemini:", error);
            setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
        }
    }, []);
    
    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (prompt: string) => {
        if (!prompt.trim() || isLoading || !chat) return;

        const newUserMessage: Message = { id: Date.now(), sender: 'user', text: prompt };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        const aiMessageId = Date.now() + 1;
        setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

        try {
            const stream = await chat.sendMessageStream({ message: prompt });
            let aiResponseText = '';
            
            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
                ));
            }
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            setMessages(prev => {
                const newMessages = prev.filter(m => m.id !== aiMessageId);
                newMessages.push({ id: Date.now(), sender: 'ai', text: "Something went wrong. Please try again." });
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (text: string) => {
        handleSendMessage(text);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };

    if (view === 'dashboard') {
        return <DashboardView onBack={() => setView('chat')} />;
    }

    const suggestions = [
        { icon: EnvelopeIcon, text: "Read important new emails" },
        { icon: ArrowUturnLeftIcon, text: "Send pending replies" },
        { icon: HandThumbDownIcon, text: "Unsubscribe newsletters" },
        { icon: CheckVIcon, text: "See who read your emails" }
    ];

    return (
        <div className="flex-grow bg-bg flex flex-col overflow-hidden">
            <header className="flex items-center justify-between p-4 shrink-0 border-b border-outline">
                <h1 className="text-3xl font-bold text-on-surface">Copilot</h1>
                <button onClick={() => setView('dashboard')} aria-label="Open Dashboard">
                    <Squares2x2Icon className="h-6 w-6 text-on-surface" />
                </button>
            </header>
            
            <main className="flex-grow overflow-y-auto px-4 pt-4">
                <div className="space-y-4 pb-4">
                    {messages.map((msg) => {
                        if (msg.text.trim() === '') return null; // Don't render empty placeholder
                        return msg.sender === 'user' ? (
                            <UserMessage key={msg.id} text={msg.text} />
                        ) : (
                            <AiMessage key={msg.id} text={msg.text} />
                        )
                    })}
                    {isLoading && <LoadingIndicator />}
                    {messages.length === 1 && !isLoading && (
                         <div className="space-y-3">
                            {suggestions.map(s => <SuggestionChip key={s.text} icon={s.icon} text={s.text} onClick={handleSuggestionClick} />)}
                         </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>

            <div className="p-4 shrink-0">
                <form onSubmit={handleFormSubmit} className="flex items-center bg-surface rounded-full p-1.5 shadow-sm">
                    <input
                        type="text"
                        placeholder="Ask me anything"
                        className="flex-grow bg-transparent outline-none px-4 text-on-surface placeholder:text-on-surface-variant"
                        aria-label="Ask me anything"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-primary-container p-2.5 rounded-full disabled:opacity-50 transition-opacity" aria-label="Send message" disabled={isLoading || !inputValue.trim()}>
                        <PaperAirplaneIcon className="h-5 w-5 text-on-surface" />
                    </button>
                </form>
            </div>
        </div>
    );
};