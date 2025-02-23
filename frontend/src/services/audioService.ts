export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingTimeout: number | null = null;

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Try MP3 first, fall back to other formats if not supported
      const mimeType = MediaRecorder.isTypeSupported('audio/mp3') ? 'audio/mp3'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg'
            : null;

      if (!mimeType) {
        throw new Error('No supported audio format found');
      }

      this.mediaRecorder = new MediaRecorder(stream, { mimeType });
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(500); // Collect data every 500ms

      // Set timeout to stop recording after 10 seconds
      this.recordingTimeout = window.setTimeout(() => {
        this.stopRecording();
      }, 10000);

    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      // Clear the timeout if it exists
      if (this.recordingTimeout) {
        window.clearTimeout(this.recordingTimeout);
        this.recordingTimeout = null;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType });
        this.audioChunks = [];
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }
}