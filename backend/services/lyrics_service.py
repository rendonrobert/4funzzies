import aiohttp
import logging
from typing import Optional, List

logger = logging.getLogger(__name__)

class LyricsService:
    BASE_URL = 'https://api.lyrics.ovh/v1'

    async def get_lyrics(self, song_info: dict) -> Optional[List[str]]:
        """Fetch lyrics from lyrics.ovh API"""
        try:
            if not song_info or not song_info.get('title') or not song_info.get('artist'):
                return None

            # Clean up artist and title for URL
            artist = song_info['artist'].strip().replace('/', '')
            title = song_info['title'].strip().replace('/', '')
            
            url = f"{self.BASE_URL}/{artist}/{title}"
            logger.info(f"Fetching lyrics from: {url}")
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'lyrics' in data:
                            # Split lyrics into lines and filter out empty lines
                            lyrics = [line.strip() for line in data['lyrics'].split('\n') if line.strip()]
                            return lyrics
            
            return None
                    
        except Exception as e:
            logger.error(f"Error fetching lyrics: {str(e)}")
            return None
