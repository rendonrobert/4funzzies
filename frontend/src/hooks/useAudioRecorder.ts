import { useState, useCallback, useRef } from 'react';

const RECORDING_DURATION = 10000; // 10 seconds

export const useAudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFormat, setAudioFormat] = useState<string>('');

  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAudioBlob(null);
    setIsRecording(false);
    setMediaRecorder(null);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [mediaRecorder]);

  const startRecording = useCallback(async () => {
    try {
      reset();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Try MP3 first, fall back to other formats if not supported
      const mimeType = MediaRecorder.isTypeSupported('audio/mp3') ? 'audio/mp3'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg'
            : null;

      if (!mimeType) {
        throw new Error('No supported audio format found');
      }

      setAudioFormat(mimeType);
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        setAudioBlob(blob);
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);

      timerRef.current = window.setTimeout(() => {
        stopRecording();
      }, RECORDING_DURATION);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      reset();
      throw error;
    }
  }, [reset, stopRecording]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    audioBlob,
    audioFormat,
    reset
  };
};