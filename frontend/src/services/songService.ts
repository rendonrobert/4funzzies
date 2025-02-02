// src/services/songService.ts

import { Song } from '../types/song';

// Load environment variables
const API_URL = 'https://vibe-app-func.azurewebsites.net/api/identify';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_AZURE_FUNCTION_KEY;

export const identifySong = async (audioBlob: Blob): Promise<Song> => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');

  try {
    console.log('Sending request to:', API_URL); // Add this for debugging

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to identify song');
    }

    return response.json();
  } catch (error) {
    console.error('Error identifying song:', error);
    throw error;
  }
};
