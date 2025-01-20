import { Song } from '../types/song';

const API_URL = 'https://vibe-app-func.azurewebsites.net/api';

export const identifySong = async (audioBlob: Blob): Promise<Song> => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');

  const response = await fetch(`${API_URL}/identify`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to identify song');
  }

  return response.json();
};
