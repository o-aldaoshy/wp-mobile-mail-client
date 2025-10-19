import React, { useContext, useState, useMemo } from 'react';
import { Message, ReplyType } from '../../types';
import { IconButton } from '../ui/IconButton';
import { 
    ArrowUturnLeftIcon, 
    EllipsisVerticalIcon, 
    ArrowLeftIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PaperAirplaneIcon,
    TrashIcon,
    DocumentTextIcon,
    ArrowUturnRightIcon,
    ReplyAllIcon,
    PaperClipIcon,
    SparklesIcon,
    PinIcon,
    ClockIcon,
    ArchiveBoxIcon,
    MoveIcon,
    StarIcon,
    EnvelopeXMarkIcon,
    ExclamationTriangleIcon,
} from '../icons';
import { AppContext } from '../../context/AppContext';
import { useResponsiveLayout } from '../../hooks/useResponsive';
import { DropdownMenu, DropdownMenuItem } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';
import { GoogleGenAI } from '@google/genai';
import { SnoozeModal } from '../SnoozeModal';

interface MessageDetailPaneProps {
  message: Message | null;
}

const formatDetailTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date).replace(',', '');
};

const formatShortTimestamp = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = today.getTime() - inputDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (diffDays > 0 && diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
};


const SingleMessageContent: React.FC<{ message: Message }> = ({ message }) => (
    <>
      <div className="flex items-center justify-between py-3">
          <div className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full">
              {message.sender.name}
          </div>
          <button className="text-accent font-semibold text-sm">Details</button>
      </div>
      
      {message.attachments.length > 0 && (
        <div className="border-t border-b border-outline">
          {message.attachments.map(att => (
            <div key={att.id} className="flex items-center py-3">
              <div className="bg-gray-200 p-2.5 rounded-full mr-4">
                  <DocumentTextIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-grow">
                  <p className="font-medium text-on-surface text-sm">{att.fileName}</p>
                  <p className="text-on-surface-variant text-xs">{att.size}</p>
              </div>
              <button className="text-accent font-semibold text-sm">Save</button>
            </div>
          ))}
        </div>
      )}
      
      <div className="prose prose-sm max-w-none text-on-surface" dangerouslySetInnerHTML={{ __html: message.body }} />
    </>
);

const ThreadMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="p-4">
      <header className="flex justify-between items-start">
        <div className="flex items-start flex-grow min-w-0">
          <Avatar name={message.sender.name} src={message.sender.avatarUrl} size="md" className="mr-3 flex-shrink-0" />
          <div className="flex-grow min-w-0">
            <p className="font-semibold text-on-surface truncate pr-2">{message.sender.name}</p>
            <p className="text-sm text-on-surface-variant mt-1">To: {message.recipients.to.join(', ')}</p>
          </div>
        </div>
        <div className="ml-2 pt-1 flex-shrink-0 flex items-center text-xs text-on-surface-variant">
            {message.attachments.length > 0 && <PaperClipIcon className="h-4 w-4 text-on-surface-variant mr-2" />}
            <span>{formatShortTimestamp(message.timestamp)}</span>
        </div>
      </header>
      
      <div className="pl-[52px] pt-4"> {/* Indent content: 40px avatar + 12px margin */}
          <div className="text-xs text-on-surface-variant mb-4">
              <p><span className="font-medium">From:</span> {message.sender.name} &lt;{message.sender.email}&gt;</p>
              {message.recipients.cc && message.recipients.cc.length > 0 && <p><span className="font-medium">Cc:</span> {message.recipients.cc.join(', ')}</p>}
              <p className="mt-1">{formatDetailTimestamp(message.timestamp)}</p>
          </div>
          
          {message.attachments.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">{message.attachments.length} Attachment{message.attachments.length > 1 ? 's' : ''}</p>
                {message.attachments.map(att => (
                  <div key={att.id} className="flex items-center py-2">
                    <div className="bg-primary-container p-2 rounded-full mr-3">
                        <DocumentTextIcon className="h-5 w-5 text-on-surface" />
                    </div>
                    <div className="flex-grow">
                        <p className="font-medium text-on-surface text-sm">{att.fileName}</p>
                        <p className="text-on-surface-variant text-xs">{att.size}</p>
                    </div>
                    <button className="text-accent font-semibold text-sm">Save</button>
                  </div>
                ))}
              </div>
          )}
          <div className="prose prose-sm max-w-none text-on-surface" dangerouslySetInnerHTML={{ __html: message.body }} />
      </div>
    </div>
  );
};


export const MessageDetailPane: React.FC<MessageDetailPaneProps> = ({ message }) => {
  const { 
    setSelectedMessage,
    messages,
    setIsReplying,
    setReplyingToMessage,
    setReplyType,
  } = useContext(AppContext);
  const { layout } = useResponsiveLayout();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);

  const isThread = message?.isThread && !!message.threadId;
  
  const threadMessages = useMemo(() => isThread
    ? messages
        .filter(m => m.threadId === message.threadId)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) // Sort oldest to newest for chronological flow
    : [], [isThread, message, messages]);

  const handleSummarize = async () => {
    if (!message) return;

    setIsSummarizing(true);
    setSummary(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      let promptText: string;
      let contentToSummarize: string;

      if (isThread && threadMessages.length > 0) {
        promptText = `Summarize the following email conversation in a few concise points:\n\n`;
        contentToSummarize = threadMessages.map(msg => {
            const textContent = msg.body.replace(/<[^>]*>?/gm, ' ').trim();
            return `From: ${msg.sender.name}\nSubject: ${msg.subject}\n\n${textContent}`;
        }).join('\n\n---\n\n');
      } else {
        promptText = `Summarize the following email in a few concise points:\n\n`;
        const textContent = message.body.replace(/<[^>]*>?/gm, ' ').trim();
        contentToSummarize = `From: ${message.sender.name}\nSubject: ${message.subject}\n\n${textContent}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText + contentToSummarize,
      });
      
      setSummary(response.text);

    } catch (error) {
      console.error("Error summarizing:", error);
      setSummary("Sorry, I couldn't create a summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleReplyAction = (type: ReplyType) => {
    if (!message) return;
    setReplyingToMessage(message);
    setReplyType(type);
    setIsReplying(true);
  };

  if (!message) {
    return <div className="hidden md:flex items-center justify-center h-full bg-surface-alt text-on-surface-variant"><p>Select a message to read</p></div>;
  }

  const menuItems = [
    { label: 'Delete', icon: TrashIcon },
    { label: 'Move', icon: MoveIcon },
    { label: 'Star', icon: StarIcon },
    { label: 'Unsubscribe', icon: EnvelopeXMarkIcon },
    { label: 'Spam', icon: ExclamationTriangleIcon },
  ];

  const handleMenuItemClick = (item: string) => {
    alert(`${item} clicked`);
    setIsMoreMenuOpen(false);
  };

  return (
    <div className="bg-surface flex flex-col h-full">
      <header className="p-4 flex items-center shrink-0">
        {layout === 'one-pane' && (
          <IconButton label="Back to list" onClick={() => setSelectedMessage(null)} className="-ml-2 mr-2">
            <ArrowLeftIcon className="h-6 w-6"/>
          </IconButton>
        )}
        <div className="flex-grow text-left min-w-0">
            <h2 className="text-lg font-semibold truncate leading-tight">{message.subject}</h2>
            {isThread ? (
                <p className="text-xs text-on-surface-variant">{threadMessages.length} messages in this conversation</p>
            ) : (
                <p className="text-xs text-on-surface-variant">{formatDetailTimestamp(message.timestamp)}</p>
            )}
        </div>
        <div className="flex items-center space-x-1 shrink-0 ml-2">
            <IconButton label="Pin"><PinIcon className="h-6 w-6" /></IconButton>
            <IconButton label="Snooze" onClick={() => setIsSnoozeModalOpen(true)}><ClockIcon className="h-6 w-6" /></IconButton>
            <IconButton label="Archive"><ArchiveBoxIcon className="h-6 w-6" /></IconButton>
            <IconButton label="Reply" onClick={() => handleReplyAction('reply')}><ArrowUturnLeftIcon className="h-6 w-6" /></IconButton>
            <div className="relative">
                <IconButton label="More options" onClick={() => setIsMoreMenuOpen(o => !o)}>
                    <EllipsisVerticalIcon className="h-6 w-6" />
                </IconButton>
                <DropdownMenu
                  isOpen={isMoreMenuOpen}
                  onClose={() => setIsMoreMenuOpen(false)}
                  position={layout === 'one-pane' ? 'popup' : 'right'}
                  className={layout === 'one-pane' ? '' : '!w-56'}
                >
                  {menuItems.map(item => (
                    <DropdownMenuItem key={item.label} icon={<item.icon className="h-5 w-5" />} onClick={() => handleMenuItemClick(item.label)}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenu>
            </div>
        </div>
      </header>
      
      <div className="flex-grow overflow-y-auto px-4">
        <div className="my-4">
            <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="flex items-center w-full bg-surface-alt text-on-surface font-semibold px-4 py-3 rounded-lg hover:bg-outline/50 disabled:opacity-50 transition-colors shadow-sm"
            >
                <SparklesIcon className="h-5 w-5 mr-3 text-primary" />
                <span>{isSummarizing ? 'Summarizing...' : isThread ? 'Summarize this Conversation' : 'Summarize this Email'}</span>
            </button>
        </div>

        {summary && (
            <div className="mb-4 p-4 bg-primary-container rounded-lg">
                <h4 className="font-bold text-on-surface mb-2">Summary</h4>
                <p className="text-on-surface-variant whitespace-pre-wrap">{summary}</p>
            </div>
        )}

        {isThread ? (
          <div className="border border-outline rounded-lg overflow-hidden mb-4">
            {threadMessages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                {index > 0 && <div className="border-t border-outline" />}
                <ThreadMessage message={msg} />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <SingleMessageContent message={message} />
        )}
      </div>
      <SnoozeModal 
        isOpen={isSnoozeModalOpen}
        onClose={() => setIsSnoozeModalOpen(false)}
      />
    </div>
  );
};