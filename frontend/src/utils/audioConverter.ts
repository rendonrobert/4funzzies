// audioConverter.ts
import lamejs from 'lamejs';

export const convertWebMtoMP3 = async (webmBlob: Blob): Promise<Blob> => {
    try {
        // Convert WebM to AudioBuffer
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const arrayBuffer = await webmBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Convert AudioBuffer to MP3 using lamejs
        const mp3Encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128);
        const samples = convertToMono(audioBuffer);
        const sampleBlockSize = 1152;
        const mp3Data = [];

        for (let i = 0; i < samples.length; i += sampleBlockSize) {
            const sampleChunk = samples.subarray(i, i + sampleBlockSize);
            const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
            if (mp3buf.length > 0) {
                mp3Data.push(mp3buf);
            }
        }

        const mp3buf = mp3Encoder.flush();
        if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
        }

        // Create MP3 Blob
        const blob = new Blob(mp3Data, { type: 'audio/mp3' });
        return blob;
    } catch (error) {
        console.error('Error converting WebM to MP3:', error);
        return webmBlob; // Return original as fallback
    }
};

// Helper function to convert stereo to mono if needed
const convertToMono = (audioBuffer: AudioBuffer): Int16Array => {
    const samples = new Int16Array(audioBuffer.length);
    const channelData = audioBuffer.getChannelData(0); // Use first channel for mono

    // Convert Float32 to Int16
    for (let i = 0; i < channelData.length; i++) {
        // Scale to 16-bit signed integer range (-32768 to 32767)
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        samples[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }

    return samples;
};