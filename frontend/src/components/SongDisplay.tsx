import React, { useState, useEffect } from 'react';
import { Song } from '../types/song';

interface SongDisplayProps {
  song: Song;
  onBack: () => void;
}

const SongDisplay: React.FC<SongDisplayProps> = ({ song, onBack }) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1);
  
  // Auto-scroll through lyrics every few seconds
  useEffect(() => {
    if (!song.lyrics || song.lyrics.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentLyricIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= song.lyrics.length) {
          return 0; // Loop back to beginning
        }
        return nextIndex;
      });
    }, 3000); // Change lyric every 3 seconds
    
    return () => clearInterval(interval);
  }, [song.lyrics]);
  
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="mb-6 px-4 py-2 flex items-center text-vibe-text-secondary hover:text-vibe-text transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      
      {/* Song Info */}
      <div className="flex items-center mb-6">
        <div className="album-art">
          {song.album_art ? (
            <img 
              src={song.album_art} 
              alt={`${song.album} by ${song.artist}`} 
              className="shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-vibe-glass rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-vibe-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="ml-5">
          <h1 className="text-xl font-bold text-vibe-text">{song.title || "Unknown Song"}</h1>
          <p className="text-vibe-text-secondary">{song.artist || "Unknown Artist"}</p>
          {song.album && <p className="text-vibe-text-secondary opacity-80">{song.album}</p>}
        </div>
      </div>
      
      {/* Lyrics Section */}
      {song.lyrics && song.lyrics.length > 0 ? (
        <div className="lyrics-container mt-6">
          <h2 className="text-lg font-semibold mb-4">Lyrics</h2>
          <div className="space-y-2">
            {song.lyrics.map((line, index) => (
              <p 
                key={index} 
                className={index === currentLyricIndex ? "highlighted-lyric" : "opacity-70"}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="lyrics-container mt-6 text-center">
          <p className="text-vibe-text-secondary">No lyrics available for this song.</p>
        </div>
      )}
    </div>
  );
};

export default SongDisplay;
