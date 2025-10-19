
import React from 'react';

interface BadgeProps {
  count: number;
}

export const Badge: React.FC<BadgeProps> = ({ count }) => {
  return (
    <div className="bg-primary-container text-primary text-xs font-medium px-2 py-0.5 rounded-full">
      {count}
    </div>
  );
};
