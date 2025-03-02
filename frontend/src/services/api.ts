import { Song } from '../types/song';
import { config } from '../config';

// Use the config values for the API URL
const API_URL = config.AZURE_FUNCTION_URL || 'https://vibe-app-func.azurewebsites.net/api/identify';

export const identifySong = async (): Promise<Song> => {
  if (!config.AZURE_FUNCTION_KEY) {
    console.error('Azure Function key is not configured');
    throw new Error('Authentication configuration missing');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-functions-key': config.AZURE_FUNCTION_KEY
    }
  });

  if (!response.ok) {
    throw new Error('Failed to identify song');
  }

  return response.json();
};