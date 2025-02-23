import React, { useEffect } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { identifySong } from '../services/songService';
import { RainbowButton } from './RainbowButton';
import { Song } from '../types/song';

interface AudioRecorderProps {
  onSongRecognized: (song: Song | null) => void;
  onError?: (error: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onSongRecognized,
  onError
}) => {
  const { startRecording, isRecording, audioBlob, progress } = useAudioRecorder();

  const handleClick = async () => {
    if (isRecording) return;

    try {
      await startRecording();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      console.error('Recording error:', errorMessage);
      onError?.(errorMessage);
    }
  };

  useEffect(() => {
    const processSong = async () => {
      if (audioBlob && !isRecording) {
        try {
          const song = await identifySong(audioBlob);
          onSongRecognized(song);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to identify song';
          console.error('Identification error:', errorMessage);
          onError?.(errorMessage);
        }
      }
    };

    processSong();
  }, [audioBlob, isRecording, onSongRecognized, onError]);

  return (
    <RainbowButton
      onClick={handleClick}
      isListening={isRecording}
      isProcessing={!isRecording && !!audioBlob}
      progress={progress}
    />
  );
};

export default AudioRecorder;