import { useState, useCallback, useRef } from 'react';

const RECORDING_DURATION = 10000; // 10 seconds

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = useCallback(async () => {
    try {
      // Clear any previous recording data
      chunksRef.current = [];
      setAudioBlob(null);
      setProgress(0);

      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up media recorder
      const mimeType = MediaRecorder.isTypeSupported('audio/mp3') ? 'audio/mp3'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
          : 'audio/webm'; // Default to webm

      console.log('Starting recording with format:', mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      // Set up recording handlers
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log('Recording completed');
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      recorder.start();
      setIsRecording(true);

      // Stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          console.log('Stopping after 10 seconds');
          mediaRecorderRef.current.stop();
        }
      }, RECORDING_DURATION);

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      throw error;
    }
  }, []);

  return {
    startRecording,
    isRecording,
    audioBlob,
    progress
  };
};