import { Song } from '../types/song';

export const identifySong = async (audioBlob: Blob): Promise<Song> => {
  if (!config.AZURE_FUNCTION_KEY) {
    console.error('Azure Function key is not configured');
    throw new Error('Authentication configuration missing');
  }

  const getFileExtension = (blob: Blob) => {
    const type = blob.type;
    console.log('Audio blob type:', type);
    console.log('Audio blob size:', blob.size, 'bytes');
    if (type.includes('mp3')) return 'mp3';
    if (type.includes('webm')) return 'webm';
    if (type.includes('ogg')) return 'ogg';
    return 'audio';
  };

  const formData = new FormData();
  const fileName = `recording.${getFileExtension(audioBlob)}`;
  formData.append('file', audioBlob, fileName);
  console.log('Sending file:', fileName);
  console.log('Azure Function URL:', config.AZURE_FUNCTION_URL);

  try {
    const response = await fetch(config.AZURE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'x-functions-key': config.AZURE_FUNCTION_KEY,
        'Accept': 'application/json',
      },
      body: formData,
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to identify song: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    if (!data.song) {
      throw new Error('Invalid response format from server');
    }

    return data.song;
  } catch (error) {
    console.error('Error identifying song:', error);
    throw error;
  }
};