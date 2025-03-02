import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="relative">
      <h1 
        className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 
                   text-transparent bg-clip-text transform hover:scale-105 transition-transform
                   duration-300 ease-in-out animate-gradient"
        style={{
          textShadow: '0 0 20px rgba(123, 97, 255, 0.3)'
        }}
      >
        Vibe
      </h1>
      <div className="mt-2 text-center text-gray-400 text-sm">
        — A 4Funzzies Project —
      </div>
    </div>
  );
};