from shazamio import Shazam
import logging

class ShazamService:
    def __init__(self):
        self.shazam = Shazam()

    async def identify_song(self, audio_data: bytes) -> dict:
        try:
            result = await self.shazam.recognize_song(audio_data)
            return self._parse_response(result)
        except Exception as e:
            logging.error(f"Error in song identification: {str(e)}")
            return None

    def _parse_response(self, response: dict) -> dict:
        try:
            track = response.get('track', {})
            return {
                'title': track.get('title'),
                'artist': track.get('subtitle'),
                'album': track.get('sections', [{}])[0].get('metadata', [{}])[0].get('text')
            }
        except Exception as e:
            logging.error(f"Error parsing Shazam response: {str(e)}")
            return None