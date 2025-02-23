import { Song } from '../types/song';
import { config } from '../config';

export const identifySong = async (audioBlob: Blob): Promise<Song> => {
  if (!config.AZURE_FUNCTION_KEY) {
    console.error('Azure Function key is not configured');
    throw new Error('Authentication configuration missing');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.ogg');

  try {
    console.log('Sending request to:', config.AZURE_FUNCTION_URL); // Debug log

    const response = await fetch(config.AZURE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'x-functions-key': config.AZURE_FUNCTION_KEY,
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `Failed to identify song: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.error || errorMessage;
      } catch {
        // If error response isn't JSON, use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.song) {
      throw new Error('Invalid response format from server');
    }

    return data.song;
  } catch (error) {
    console.error('Error identifying song:', error);
    throw error instanceof Error ? error : new Error('Failed to identify song');
  }
};