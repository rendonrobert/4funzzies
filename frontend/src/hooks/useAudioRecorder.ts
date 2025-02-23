import { useState, useCallback, useRef, useEffect } from 'react';

const RECORDING_DURATION = 10000; // 10 seconds

export const useAudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFormat, setAudioFormat] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording...');
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  }, [mediaRecorder]);

  const reset = useCallback(() => {
    chunksRef.current = [];
    setProgress(0);
    setAudioBlob(null);
    setMediaRecorder(null);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (isRecording) {
        stopRecording();
      }
      reset();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/mp3') ? 'audio/mp3'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg'
            : null;

      if (!mimeType) {
        throw new Error('No supported audio format found');
      }

      setAudioFormat(mimeType);
      console.log('Using audio format:', mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log('MediaRecorder stopped');
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setIsRecording(false);
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start(500);

      // Set timeout to stop recording
      timerRef.current = setTimeout(() => {
        console.log('Recording timeout reached');
        stopRecording();
      }, RECORDING_DURATION);

    } catch (error) {
      console.error('Error starting recording:', error);
      stopRecording();
      reset();
      throw error;
    }
  }, [isRecording, stopRecording, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      reset();
    };
  }, [stopRecording, reset]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    audioBlob,
    audioFormat,
    progress,
    reset
  };
};