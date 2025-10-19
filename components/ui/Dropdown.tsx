
import React, { useEffect, useRef } from 'react';

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  position?: 'right' | 'bottom-sheet' | 'popup';
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose, children, className, position = 'right' }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only use click-outside-to-close for the 'right' positioned popover
    if (position !== 'right' || !isOpen) {
        return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, position]);

  if (!isOpen) return null;

  if (position === 'popup') {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/30 z-40" 
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <div
            className={`bg-surface rounded-2xl shadow-2xl w-full max-w-xs ${className}`}
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="p-2">
                {children}
            </div>
          </div>
        </div>
      </>
    )
  }

  if (position === 'bottom-sheet') {
    return (
        <>
            <div 
                className="fixed inset-0 bg-black/30 z-40" 
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className={`fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl shadow-2xl z-50 p-4 animate-slide-up ${className}`}
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="w-10 h-1.5 bg-outline rounded-full mx-auto mb-4"></div>
                {children}
            </div>
        </>
    )
  }

  const baseClasses = "absolute bg-surface rounded-xl shadow-xl w-40 z-20 p-2";
  const defaultPosition = "top-full right-0 mt-2";

  return (
    <div
      ref={dropdownRef}
      className={`${baseClasses} ${className || defaultPosition}`}
    >
      {children}
    </div>
  );
};

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center text-left px-4 py-2.5 text-on-surface hover:bg-primary-container/50 rounded-lg text-base"
    >
      {icon && <div className="mr-3 text-on-surface-variant">{icon}</div>}
      <span className="flex-grow">{children}</span>
    </button>
  );
};
