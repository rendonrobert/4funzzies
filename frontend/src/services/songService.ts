import { Song } from '../types/song';
import { config } from '../config';
import { convertWebMtoMP3 } from '../utils/audioConverter';

export const identifySong = async (audioBlob: Blob): Promise<Song> => {
  if (!config.AZURE_FUNCTION_KEY) {
    console.error('Azure Function key is not configured');
    throw new Error('Authentication configuration missing');
  }

  try {
    // Convert WebM to WAV if needed
    let processedBlob = audioBlob;
    if (audioBlob.type.includes('webm')) {
      console.log('Converting WebM to WAV...');
      processedBlob = await convertWebMtoMP3(audioBlob);
      console.log('Conversion complete');
    }

    const getFileExtension = (blob: Blob) => {
      const type = blob.type;
      console.log('Audio blob type:', type);
      console.log('Audio blob size:', blob.size, 'bytes');
      if (type.includes('mp3')) return 'mp3';
      if (type.includes('wav')) return 'wav';
      if (type.includes('webm')) return 'webm';
      if (type.includes('ogg')) return 'ogg';
      return 'audio';
    };

    const formData = new FormData();
    const fileExtension = getFileExtension(processedBlob);
    const fileName = `recording.${fileExtension}`;

    // Use the processed blob
    formData.append('file', processedBlob, fileName);
    console.log('Sending file:', fileName);
    console.log('Azure Function URL:', config.AZURE_FUNCTION_URL);

    // Try both methods for authentication
    let response;
    let error;

    // Method 1: Header authentication
    try {
      response = await fetch(config.AZURE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'x-functions-key': config.AZURE_FUNCTION_KEY,
          'Accept': 'application/json',
        },
        body: formData,
      });
    } catch (e) {
      error = e;
    }

    // Method 2: Query param authentication (if method 1 failed)
    if (!response || !response.ok) {
      try {
        const url = `${config.AZURE_FUNCTION_URL}?code=${encodeURIComponent(config.AZURE_FUNCTION_KEY)}`;
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formData,
        });
      } catch (e) {
        // If both methods fail, throw the original error
        if (error) throw error;
        throw e;
      }
    }

    if (!response) {
      throw new Error('Failed to make request to Azure Function');
    }

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to identify song: ${response.status} - ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      if (!data.song) {
        console.error('Missing song data in response:', data);
        throw new Error('Invalid response format from server');
      }

      return data.song;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error identifying song:', error);
    throw error;
  }
};
