import { Song } from '../types/song';

const API_URL = process.env.REACT_APP_API_URL || 'https://vibe-app-func.azurewebsites.net/api/identify';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_AZURE_FUNCTION_KEY;

export const identifySong = async (audioBlob: Blob): Promise<Song> => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-functions-key': ACCESS_TOKEN || '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error ||
        `Failed to identify song: ${response.status} ${response.statusText}`
      );
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