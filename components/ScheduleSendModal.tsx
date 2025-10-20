import React from 'react';
import ReactDOM from 'react-dom';

interface ScheduleSendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleOption: React.FC<{ label: string; time: string; onClick: () => void; }> = ({ label, time, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center py-4 text-left px-4">
        <span className="text-lg text-on-surface">{label}</span>
        <span className="text-on-surface-variant">{time}</span>
    </button>
);

export const ScheduleSendModal: React.FC<ScheduleSendModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    const handleSchedule = (option: string) => {
        alert(`Send scheduled for: ${option}`);
        onClose();
    };
    
    // Time calculations
    const now = new Date();
    
    const laterToday = new Date();
    laterToday.setHours(laterToday.getHours() + 3);
    const laterTodayTime = laterToday.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const tomorrowTime = tomorrow.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const thisWeekend = new Date();
    const dayOfWeek = thisWeekend.getDay();
    const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek);
    thisWeekend.setDate(thisWeekend.getDate() + daysUntilSaturday);
    thisWeekend.setHours(9, 0, 0, 0);
    const thisWeekendTime = `Sat ${thisWeekend.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

    const nextWeek = new Date();
    const daysUntilMonday = ((1 - nextWeek.getDay() + 7) % 7) || 7;
    nextWeek.setDate(nextWeek.getDate() + daysUntilMonday);
    nextWeek.setHours(9, 0, 0, 0);
    const nextWeekTime = `Mon ${nextWeek.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

    const scheduleOptions = [
        { label: 'Later Today', time: laterTodayTime, handler: () => handleSchedule(`Later Today, ${laterTodayTime}`) },
        { label: 'Tomorrow', time: tomorrowTime, handler: () => handleSchedule(`Tomorrow, ${tomorrowTime}`) },
        { label: 'This Week', time: thisWeekendTime, handler: () => handleSchedule(`This Week, ${thisWeekendTime}`) },
        { label: 'Next Week', time: nextWeekTime, handler: () => handleSchedule(`Next Week, ${nextWeekTime}`) },
        { label: 'Pick Date', time: '', handler: () => handleSchedule('Pick Date') },
    ];

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 bg-black/40 z-[60] flex items-end"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="fixed bottom-4 left-4 right-4 bg-surface rounded-2xl shadow-2xl p-2 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-on-surface p-4">Schedule send</h2>
                <ul>
                    {scheduleOptions.map((option, index) => (
                        <li key={index}>
                            <ScheduleOption label={option.label} time={option.time} onClick={option.handler} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>,
        document.body
    );
};