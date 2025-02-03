import { Song } from '../types/song';

const API_URL = process.env.REACT_APP_API_URL || 'https://vibe-app-func.azurewebsites.net/api/identify';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_AZURE_FUNCTION_KEY;

export const identifySong = async (audioBlob: Blob): Promise<Song> => {
  if (!ACCESS_TOKEN) {
    console.error('Azure Function key is not configured');
    throw new Error('Authentication configuration missing');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');

  try {
    console.log('Sending request to:', API_URL); // Debug log

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-functions-key': ACCESS_TOKEN,
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
