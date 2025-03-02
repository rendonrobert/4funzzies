# Vibe App Frontend

This is the frontend for the Vibe App, a song identification application that connects to an Azure Functions backend using ShazamIO and lyrics.ovh.

## Features

- Modern, responsive design
- Audio recording from device microphone
- WebM to WAV audio conversion
- Song identification using Azure Function backend
- Lyrics display with auto-scrolling

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure the application:
   - Open `src/config.ts`
   - Update `AZURE_FUNCTION_KEY` with your Azure Function key
   - Verify `AZURE_FUNCTION_URL` is correct

3. Start the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## Project Structure

- `/src/components` - React components
- `/src/hooks` - Custom React hooks
- `/src/services` - API and service functions
- `/src/utils` - Utility functions
- `/src/types` - TypeScript type definitions
- `/src/assets` - Static assets like images

## Key Components

- **AudioRecorder**: Handles recording audio from the device microphone
- **RainbowButton**: Stylized button with animation effects
- **SongDisplay**: Displays identified song with album art and lyrics
- **VibeLogo**: The app's logo with animated effects

## Technologies

- React with TypeScript
- TailwindCSS for styling
- Web Audio API for audio processing
- Fetch API for backend communication

## Notes on Audio Handling

The app records audio in WebM format and then converts it to WAV format for better compatibility with the backend. The conversion happens client-side using the Web Audio API.

## Authentication

The app supports multiple authentication methods for the Azure Function:
- Function key in the `x-functions-key` header
- Function key as a query parameter

## Troubleshooting

If you encounter authentication issues with the Azure Function:
1. Check that your function key is correct
2. Try using the master key instead of a function-specific key
3. Verify CORS settings in your Azure Function app
4. Check the Network tab in your browser's developer tools for detailed error information
