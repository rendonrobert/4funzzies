import requests
import logging
from typing import Optional, List

logger = logging.getLogger(__name__)

class LyricsService:
    BASE_URL = 'https://api.lyrics.ovh/v1'

    @staticmethod
    def get_lyrics(artist: str, title: str) -> Optional[List[str]]:
        """Fetch lyrics from lyrics.ovh API"""
        try:
            # Clean up artist and title for URL
            artist = artist.strip().replace('/', '')
            title = title.strip().replace('/', '')
            
            url = f"{LyricsService.BASE_URL}/{artist}/{title}"
            logger.info(f"Fetching lyrics from: {url}")
            
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                if 'lyrics' in data:
                    # Split lyrics into lines and filter out empty lines
                    lyrics = [line.strip() for line in data['lyrics'].split('\n') if line.strip()]
                    return lyrics
            
            return None
                    
        except Exception as e:
            logger.error(f"Error fetching lyrics: {str(e)}")
            return None