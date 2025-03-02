import { Song } from '../types/song';

const API_URL = 'http://localhost:8000';

export const identifySong = async (): Promise<Song> => {
  const response = await fetch(`${API_URL}/api/identify`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to identify song');
  }

  return response.json();
};