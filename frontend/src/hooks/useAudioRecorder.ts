import { useState, useCallback, useRef, useEffect } from 'react';

const RECORDING_DURATION = 10000; // 10 seconds

export const useAudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFormat, setAudioFormat] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const chunksRef = useRef<BlobPart[]>([]);

  const reset = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    chunksRef.current = [];
    setProgress(0);
    progressRef.current = 0;
    setAudioBlob(null);
    setIsRecording(false);
    setMediaRecorder(null);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      console.log('Stopping recording');
      mediaRecorder.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  const startRecording = useCallback(async () => {
    try {
      // First ensure any existing recording is stopped
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        stopRecording();
      }
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
      console.log('Using audio format:', mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log('Recording stopped');
        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log('Blob created:', blob.size, 'bytes');
        setAudioBlob(blob);
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      // Start recording with smaller chunks for more frequent updates
      recorder.start(500); // Changed from 1000 to 500ms for more frequent updates
      setMediaRecorder(recorder);
      setIsRecording(true);
      setProgress(0);
      progressRef.current = 0;

      // Set a hard timeout
      timerRef.current = window.setTimeout(() => {
        console.log('Recording timeout reached');
        stopRecording();
      }, RECORDING_DURATION);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      reset();
      throw error;
    }
  }, [reset, stopRecording, mediaRecorder]);

  // Progress tracking effect
  useEffect(() => {
    if (isRecording) {
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / RECORDING_DURATION) * 100, 100);
        progressRef.current = newProgress;
        setProgress(newProgress);

        if (newProgress < 100 && isRecording) {
          requestAnimationFrame(updateProgress);
        }
      };

      const animationFrame = requestAnimationFrame(updateProgress);

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [isRecording]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

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