import React from 'react';
import { Logo } from './components/Logo';
import { SongInfo } from './components/SongInfo/SongInfo';
import { Lyrics } from './components/Lyrics';
import AudioRecorder from './components/AudioRecorder';
import { Song } from './types/song';

const App: React.FC = () => {
  const [songData, setSongData] = React.useState<Song | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSongRecognized = (song: Song | null) => {
    if (song && song.title !== "Unknown Song") {
      setSongData(song);
      setError(null);
    } else {
      setError("Sorry, but we cannot Jive to this at the moment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-zinc-900">
      {/* Background Cover Art */}
      {songData?.album_art && (
        <div className="fixed inset-0 w-full h-full">
          <div 
            className="absolute w-[200%] h-[200%] left-[-50%] top-[-50%]"
            style={{ 
              backgroundImage: `url(${songData.album_art})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              transform: 'scale(0.5)',
              filter: 'blur(100px)',
            }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-8 py-8">
        {!songData ? (
          // Initial Screen Layout
          <div className="flex flex-col items-center justify-center flex-1 space-y-8">
            <h1 
              data-text="Vibe"
              className="logo-glitch logo-text relative inline-block text-[17vw] tracking-[15px] font-light m-0 leading-[0.9]"
            >
              Vibe
            </h1>
            <AudioRecorder onSongRecognized={handleSongRecognized} />
            {error && (
              <div className="text-red-400 text-center font-semibold text-lg animate-fade-in">
                {error}
              </div>
            )}
            <div className="project-subtext">
              A <span className="funzzies">4Funzzies</span> Project
            </div>
          </div>
        ) : (
          // Post-Recognition Layout
          <div className="space-y-6 w-full max-w-2xl">
            <div className="flex items-center justify-between">
              <h1 className="logo-text relative inline-block text-[8vw] tracking-[5px] text-white font-harlow">
                Vibe
              </h1>
              <AudioRecorder onSongRecognized={handleSongRecognized} />
            </div>

            <div className="space-y-8 animate-fade-in">
              <SongInfo song={songData} />
              {songData.lyrics && songData.lyrics.length > 0 && (
                <Lyrics lyrics={songData.lyrics} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
