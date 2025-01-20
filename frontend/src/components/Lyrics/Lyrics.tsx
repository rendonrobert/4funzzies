import React from 'react';

interface LyricsProps {
  lyrics: string[];
}

const Lyrics: React.FC<LyricsProps> = ({ lyrics }) => {
  return (
    <div className="mt-8 bg-black/20 p-6 rounded-lg backdrop-blur-lg max-h-[60vh] overflow-y-auto">
      <div className="space-y-4">
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

export default Lyrics;