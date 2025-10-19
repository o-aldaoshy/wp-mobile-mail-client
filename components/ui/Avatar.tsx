
import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className = '' }) => {
  const baseClasses = 'rounded-full flex items-center justify-center font-semibold text-on-primary';
  const colorClasses = 'bg-primary'; // A simple single color, could be dynamic based on name hash

  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${colorClasses} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
