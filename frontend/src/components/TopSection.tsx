import React from 'react';
import { Logo } from './Logo';

interface TopSectionProps {
  isIdentifying: boolean;
  onIdentify: () => void;
}

export const TopSection: React.FC<TopSectionProps> = ({ isIdentifying, onIdentify }) => {
  return (
    <div className="text-center space-y-8 mb-8">
      <Logo />
      <button
        onClick={onIdentify}
        disabled={isIdentifying}
        className={`button-85 ${isIdentifying ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isIdentifying ? 'Listening...' : 'ID Song'}
      </button>
    </div>
  );
};