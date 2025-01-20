import React from 'react';

interface SongIdentifierProps {
  onIdentify: () => void;
  isIdentifying: boolean;
}

const SongIdentifier: React.FC<SongIdentifierProps> = ({ onIdentify, isIdentifying }) => {
  return (
    <button
      onClick={onIdentify}
      disabled={isIdentifying}
      className={`
        relative px-6 py-2 text-white font-semibold
        rounded-lg bg-gradient-to-r from-green-400 to-blue-400
        transform hover:scale-105 transition-all duration-300
        hover:shadow-lg hover:shadow-green-400/50
        active:scale-95
        ${isIdentifying ? 'animate-pulse' : 'animate-glow'}
      `}
      style={{
        boxShadow: '0 0 20px rgba(74, 222, 128, 0.4)'
      }}
    >
      <span className="relative z-10">
        ID Song {isIdentifying ? '...' : ''}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-75 blur-lg rounded-lg" />
    </button>
  );
};

export default SongIdentifier;