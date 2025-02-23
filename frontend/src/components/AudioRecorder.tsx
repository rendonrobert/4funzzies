import React, { useState } from 'react';
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
  const {
    startRecording,
    isRecording,
    audioBlob,
    progress,
    reset
  } = useAudioRecorder();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    if (isRecording || isProcessing) return;

    try {
      await startRecording();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      console.error('Recording error:', errorMessage);
      onError?.(errorMessage);
    }
  };

  React.useEffect(() => {
    const identifyAudio = async () => {
      if (audioBlob && !isRecording) {
        setIsProcessing(true);
        try {
          const song = await identifySong(audioBlob);
          onSongRecognized(song);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to identify song';
          console.error('Identification error:', errorMessage);
          onError?.(errorMessage);
        } finally {
          setIsProcessing(false);
          reset();
        }
      }
    };

    identifyAudio();
  }, [audioBlob, isRecording, onSongRecognized, onError, reset]);

  return (
    <RainbowButton
      onClick={handleClick}
      isListening={isRecording}
      isProcessing={isProcessing}
      progress={progress}
    />
  );
};

export default AudioRecorder;