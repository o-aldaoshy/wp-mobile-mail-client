
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, label, className, ...props }) => {
  const baseClasses = "rounded-full p-2 text-on-surface-variant hover:bg-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <button aria-label={label} className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};
