import React from 'react';
import { Song } from '../../types/song';

interface SongInfoProps {
  song: Song;
}

export const SongInfo: React.FC<SongInfoProps> = ({ song }) => {
  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-5">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 relative overflow-hidden rounded-lg">
          <img 
            src={song.album_art || 'https://via.placeholder.com/150'} 
            alt={`${song.album || song.title} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 shadow-inner" />
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white mb-1">
            {song.title}
          </h2>
          <p className="text-gray-300 text-sm">
            {song.artist}
          </p>
          {song.album && (
            <p className="text-gray-400 text-sm">
              {song.album}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};