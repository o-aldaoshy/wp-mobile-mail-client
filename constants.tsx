

import { Message, Account, Folder, SmimeStatus, GroupChat } from './types';
import { 
    PinIcon, DocumentDuplicateIcon, ExclamationTriangleIcon, TrashIcon, ArchiveBoxIcon,
    EnvelopeOpenIcon, FolderIcon, EnvelopeIcon, SparklesIcon, ExchangeIcon,
    UsersIcon, MegaphoneIcon
} from './components/icons';

export const FOLDERS: Folder[] = [
    { id: 'inbox', name: 'Inbox', icon: FolderIcon, unreadCount: 14 },
    { id: 'unread', name: 'Unread', icon: EnvelopeOpenIcon, unreadCount: 14 },
    { id: 'flagged', name: 'Flagged', icon: PinIcon },
    { id: 'vips', name: 'VIPs', icon: SparklesIcon, isVip: true },
    { id: 'sent', name: 'Sent', icon: EnvelopeIcon },
    { id: 'drafts', name: 'Drafts', icon: DocumentDuplicateIcon },
    { id: 'spam', name: 'Spam', icon: ExclamationTriangleIcon },
    { id: 'trash', name: 'Trash', icon: TrashIcon },
    { id: 'archive', name: 'My Drive', icon: ArchiveBoxIcon },
];

export const ACCOUNTS: Account[] = [
    {
        id: 'acc1',
        name: 'Alex Johnson',
        email: 'o.aldaoshy@roaya.co',
        providerIcon: ExchangeIcon,
        folders: FOLDERS,
    },
    {
        id: 'acc2',
        name: 'Samantha Bee',
        email: 's.bee@workplace.com',
        avatarUrl: 'https://picsum.photos/seed/samantha/100/100',
        folders: FOLDERS,
    }
];

export const INITIAL_GROUP_CHATS: GroupChat[] = [
  {
    id: 'gc1',
    name: 'test 2',
    lastMessage: 'You created the group.',
    timestamp: new Date(),
    avatarColor: 'bg-yellow-100 dark:bg-yellow-900/50',
    lastMessageIcon: UsersIcon,
    readReceiptStatus: 'sent',
    messages: [{ text: 'You created the group.', sender: 'system' }],
  },
  {
    id: 'gc2',
    name: 'test',
    lastMessage: 'You changed the group settings to allow all members to send me...',
    timestamp: new Date(Date.now() - 9 * 60 * 1000), // 9 minutes ago
    avatarColor: 'bg-blue-100 dark:bg-blue-900/50',
    lastMessageIcon: MegaphoneIcon,
    readReceiptStatus: 'read',
    messages: [],
  },
];


export const MESSAGES: Message[] = [
  {
      id: 'msg_google',
      sender: { name: 'Google Cloud', email: 'no-reply@google.com' },
      recipients: { to: ['alex.j@example.com'] },
      subject: "Here's your copy of th...",
      snippet: "Your requested document is attached...",
      body: '<p>See attached.</p>',
      timestamp: new Date('2025-10-07T09:49:00'),
      isRead: true,
      isFlagged: false,
      isThread: false,
      attachments: [],
      folder: 'inbox',
      smimeStatus: SmimeStatus.NONE,
      isAnswered: true,
      isFavorite: false,
      category: 'Updates',
  },
  {
      id: 'msg_aws',
      sender: { name: 'Amazon Web Services', email: 'no-reply@aws.amazon.com' },
      recipients: { to: ['alex.j@example.com'] },
      subject: "Enterprise architects r...",
      snippet: "Learn how to build scalable applications...",
      body: '<p>Learn more about AWS architecture.</p>',
      timestamp: new Date('2025-10-07T11:33:00'),
      isRead: true,
      isFlagged: false,
      isThread: false,
      attachments: [],
      folder: 'inbox',
      smimeStatus: SmimeStatus.NONE,
      isAnswered: false,
      isFavorite: false,
      category: 'Promotions',
  },
  {
    id: 'msg1',
    sender: { name: 'ClickUp Notifications', email: 'elara.v@copilot.com' },
    recipients: { to: ['alex.j@example.com'] },
    subject: 'Daily Summary I WorldPosta Sales T...',
    snippet: 'Due Today: 1, Tomorrow: 1, Overdue: 14...',
    body: '<p>Hey team,</p><p>Let\'s review the progress from this week and outline our priorities for the upcoming sprint. I\'ve attached the updated timeline for your reference.</p><p>Best,<br/>Elara</p>',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isRead: false,
    isFlagged: true,
    isThread: true,
    threadId: 'thread-clickup',
    threadCount: 2,
    attachments: [],
    folder: 'inbox',
    smimeStatus: SmimeStatus.VALID,
    isAnswered: true,
    isFavorite: true,
    labels: ['Updates'],
    category: 'Updates',
  },
  {
    id: 'msg2',
    sender: { name: 'Xmind', email: 'newsletter@designweekly.co' },
    recipients: { to: ['o.aldaoshy@roaya.co'] },
    subject: 'Reset Your Password',
    snippet: 'The verification code is N6X38V for password reset...',
    body: `
      <div style="padding: 1rem 0; color: #6c757d; font-weight: 500; font-size: 0.8rem; text-align: right; border-top: 1px solid #dee2e6; border-bottom: 1px solid #dee2e6; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="width: 60px; height: 75px; border: 1px solid #dee2e6; border-radius: 8px; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="#ced4da" style="width: 32px; height: 32px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm16.5-1.5H3.75" />
            </svg>
          </div>
          <span>ACCOUNT UPDATES</span>
      </div>
      <div style="padding: 2rem 0.5rem; font-family: sans-serif; color: #212529;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem;">
          Hi, <a href="#" style="color: #0d6efd; text-decoration: none;">o.aldaoshy@roaya.co</a>!
        </h2>
        <p style="margin-bottom: 1rem; line-height: 1.6;">
          Thank you for supporting <b>Xmind</b>.
        </p>
        <p style="margin-bottom: 1rem; line-height: 1.6;">
          The verification code is <b>N6X38V</b> for password reset. For the security of your account, please complete the verification within 60 minutes.
        </p>
        <p style="line-height: 1.6;">
          If you didn't request a password reset, please feel free to ignore this email, and your password will not be changed.
        </p>
      </div>`,
    timestamp: new Date('2025-10-13T14:17:00'),
    isRead: true,
    isFlagged: false,
    isThread: false,
    attachments: [{ id: 'att1', fileName: 'SECURITY_WARNING_FROM_WP.txt', size: '912 B', type: 'document' }],
    folder: 'inbox',
    smimeStatus: SmimeStatus.NONE,
    isAnswered: false,
    isFavorite: false,
    category: 'Updates',
  },
  {
    id: 'msg3',
    sender: { name: 'WorldPosta Tools', email: 'ben.c@example.com' },
    recipients: { to: ['alex.j@example.com'] },
    subject: 'New Customer Signed Up User Name: Cai...',
    snippet: 'Account registeration Admin notification,...',
    body: '<p>Thanks for sending this over. I have a few questions regarding the marketing spend allocation. Can we chat for 15 minutes this afternoon?</p>',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    isFlagged: true,
    isThread: true,
    threadId: 'thread-worldposta',
    threadCount: 2,
    attachments: [],
    folder: 'inbox',
    smimeStatus: SmimeStatus.UNKNOWN,
    isAnswered: true,
    isFavorite: false,
    labels: ['Personal'],
    category: 'Primary',
  },
  {
    id: 'msg4',
    sender: { name: 'ClickUp Notifications', email: 'support@acme.com' },
    recipients: { to: ['alex.j@example.com'] },
    subject: 'Daily Summary I WorldPosta Sales T...',
    snippet: 'Due Today: 0, Tomorrow: 1, Overdue: 14...',
    body: '<p>A new device has signed into your Acme Inc. account from a new location. If this wasn\'t you, please secure your account immediately.</p>',
    timestamp: new Date(), // Now
    isRead: true,
    isFlagged: true,
    isThread: false,
    threadId: 'thread-clickup',
    attachments: [{ id: 'att2', fileName: 'security.pdf', size: '1.2MB', type: 'pdf' }],
    folder: 'inbox',
    smimeStatus: SmimeStatus.INVALID,
    isAnswered: false,
    isFavorite: true,
    labels: ['Social'],
    category: 'Social',
  },
  {
    id: 'msg_forum',
    sender: { name: 'StackOverflow Digest', email: 'digest@stackoverflow.com' },
    recipients: { to: ['alex.j@example.com'] },
    subject: "Top questions from this week",
    snippet: "Here are the top questions from the tags you follow...",
    body: '<p>See the latest questions.</p>',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: false,
    isFlagged: false,
    isThread: false,
    attachments: [],
    folder: 'inbox',
    smimeStatus: SmimeStatus.NONE,
    isAnswered: false,
    isFavorite: false,
    category: 'Forums',
  },
  {
    id: 'msg5',
    sender: { name: 'WorldPosta Tools', email: 'lena.p@example.com' },
    recipients: { to: ['alex.j@example.com'] },
    subject: 'New Customer Signed Up User Name: Pe...',
    snippet: 'Account registeration Admin notif...',
    body: '<p>Finally got around to uploading the photos from our trip! Here\'s the link to the album. Hope you enjoy them!</p>',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
    isRead: true,
    isFlagged: false,
    isThread: false,
    threadId: 'thread-worldposta',
    attachments: [],
    folder: 'in_design',
    smimeStatus: SmimeStatus.NONE,
    isAnswered: false,
    isFavorite: false,
    labels: ['Forums'],
    category: 'Primary',
  },
   {
    id: 'msg6',
    sender: { name: 'ClickUp Team', email: 'team@clickup.com' },
    recipients: { to: ['alex.j@example.com'] },
    subject: 'New login to your ClickUp account',
    snippet: 'A new login to your ClickUp account has been detected.',
    body: '<p>A new login to your ClickUp account has been detected.</p>',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // Last week
    isRead: true,
    isFlagged: false,
    isThread: false,
    attachments: [{ id: 'att3', fileName: 'login-details.txt', size: '1KB', type: 'document' }],
    folder: 'in_design',
    smimeStatus: SmimeStatus.NONE,
    isAnswered: true,
    isFavorite: false,
    category: 'Updates',
  },
];