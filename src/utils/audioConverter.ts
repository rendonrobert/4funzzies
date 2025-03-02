export const convertWebMtoMP3 = async (webmBlob: Blob): Promise<Blob> => {
    try {
        // Use the Web Audio API to process the audio
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const arrayBuffer = await webmBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Create a WAV file instead - it's more widely supported than WebM
        const wavBlob = await audioBufferToWav(audioBuffer);
        console.log('Converted WebM to WAV successfully');
        return wavBlob;
    } catch (error) {
        console.error('Error converting audio:', error);
        return webmBlob; // Return original as fallback
    }
};

// Helper function to convert AudioBuffer to WAV
function audioBufferToWav(audioBuffer: AudioBuffer): Promise<Blob> {
    return new Promise(resolve => {
        const numberOfChannels = audioBuffer.numberOfChannels;
        const length = audioBuffer.length;
        const sampleRate = audioBuffer.sampleRate;
        const bitsPerSample = 16;
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numberOfChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = length * blockAlign;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        // Write WAV header
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM format
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(view, 36, 'data');
        view.setUint32(40, dataSize, true);

        // Write audio data
        const floatSamples = [];
        for (let channel = 0; channel < numberOfChannels; channel++) {
            floatSamples.push(audioBuffer.getChannelData(channel));
        }

        let offset = 44;
        for (let i = 0; i < length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = Math.max(-1, Math.min(1, floatSamples[channel][i]));
                const val = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                view.setInt16(offset, val, true);
                offset += 2;
            }
        }

        const wavBlob = new Blob([buffer], { type: 'audio/wav' });
        resolve(wavBlob);
    });
}

function writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}