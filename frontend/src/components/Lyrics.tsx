import React from 'react';

interface LyricsProps {
  lyrics: string[];
}

export const Lyrics: React.FC<LyricsProps> = ({ lyrics }) => {
  if (!lyrics.length) {
    return (
      <div className="mt-8 text-center text-gray-400">
        No lyrics available for this song
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-5 h-[400px] flex flex-col">
      <div className="overflow-y-auto flex-1">
        {lyrics.map((line, index) => (
          <p 
            key={index}
            className="text-gray-200 text-lg leading-relaxed transition-colors duration-300 hover:text-white"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};