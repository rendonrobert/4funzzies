import React from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { identifySong } from '../services/songService';
import { Song } from '../types/song';
import { RainbowButton } from './RainbowButton';

interface AudioRecorderProps {
  onSongRecognized: (song: Song) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSongRecognized }) => {
  const { startRecording, isRecording, audioBlob, reset } = useAudioRecorder();

  const handleClick = async () => {
    if (isRecording) return;
    
    try {
      await startRecording();
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  React.useEffect(() => {
    const identifyAudio = async () => {
      if (audioBlob && !isRecording) {
        try {
          const song = await identifySong(audioBlob);
          onSongRecognized(song);
          reset();
        } catch (err) {
          console.error('Failed to identify song:', err);
          reset();
        }
      }
    };

    identifyAudio();
  }, [audioBlob, isRecording, onSongRecognized, reset]);

  return (
    <RainbowButton onClick={handleClick} isListening={isRecording} />
  );
};

export default AudioRecorder;