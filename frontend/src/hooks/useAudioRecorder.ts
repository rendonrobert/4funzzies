import { useState, useCallback, useRef } from 'react';
import { config } from '../config';

interface AudioRecorderState {
  isRecording: boolean;
  audioBlob: Blob | null;
  progress: number;
  startRecording: () => Promise<void>;
}

export const useAudioRecorder = (): AudioRecorderState => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const progressIntervalRef = useRef<number | null>(null);
  
  const startRecording = useCallback(async () => {
    // Reset state
    setAudioBlob(null);
    setProgress(0);
    chunksRef.current = [];
    
    try {
      // Request access to microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event listeners
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', () => {
        setIsRecording(false);
        
        // Create blob from all chunks
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks to properly close the microphone
        stream.getTracks().forEach(track => track.stop());
        
        console.log('Recording completed');
      });
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      console.log('Starting recording with format:', mediaRecorder.mimeType);
      
      // Set up progress tracking
      const maxRecordingSeconds = config.MAX_RECORDING_SECONDS;
      let elapsed = 0;
      
      progressIntervalRef.current = window.setInterval(() => {
        elapsed += 0.1;
        setProgress((elapsed / maxRecordingSeconds) * 100);
        
        if (elapsed >= maxRecordingSeconds) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            console.log('Stopping after', maxRecordingSeconds, 'seconds');
            mediaRecorderRef.current.stop();
          }
        }
      }, 100);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new Error('Could not access microphone. Please check permissions.');
    }
  }, []);
  
  return {
    isRecording,
    audioBlob,
    progress,
    startRecording
  };
};
