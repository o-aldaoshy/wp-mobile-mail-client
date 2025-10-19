
import React from 'react';

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({ label, icon, isActive = false, onClick }) => {
  const baseClasses = 'flex items-center space-x-2 text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors duration-200';
  const activeClasses = 'bg-primary-container text-primary';
  const inactiveClasses = 'bg-surface-alt hover:bg-outline/10 text-on-surface-variant';

  return (
    <div
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};
