import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import SongDisplay from './components/SongDisplay';
import VibeLogo from './components/VibeLogo';
import ErrorDisplay from './components/ErrorDisplay';
import { Song } from './types/song';

function App() {
  const [recognizedSong, setRecognizedSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSongRecognized = (song: Song | null) => {
    setRecognizedSong(song);
  };
  
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };
  
  const resetRecognition = () => {
    setRecognizedSong(null);
  };
  
  const clearError = () => {
    setError(null);
  };
  
  const handleRecordingStart = () => {
    setIsRecording(true);
  };
  
  const handleRecordingEnd = () => {
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-vibe-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        {recognizedSong ? (
          // Display the recognized song and lyrics
          <SongDisplay 
            song={recognizedSong} 
            onBack={resetRecognition} 
          />
        ) : (
          // Home screen with Vibe logo and recording button
          <div className="flex flex-col items-center justify-center">
            <VibeLogo animated={!isRecording} />
            
            <div className="mt-8 mb-16">
              <AudioRecorder 
                onSongRecognized={handleSongRecognized}
                onError={handleError}
                onRecordingStart={handleRecordingStart}
                onRecordingEnd={handleRecordingEnd}
              />
            </div>
            
            <p className="text-vibe-text-secondary text-center mt-8">
              Tap the button to identify what's playing
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <ErrorDisplay message={error} onDismiss={clearError} />
      )}
    </div>
  );
}

export default App;
