from shazamio import Shazam
import logging
from typing import Optional, Dict, Any
from lyrics_service import LyricsService

logger = logging.getLogger(__name__)

class ShazamService:
    def __init__(self):
        self.shazam = Shazam()
    
    async def recognize_song(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Recognize a song using Shazam's API and get lyrics from lyrics.ovh"""
        try:
            result = await self.shazam.recognize_song(file_path)
            
            if not result or not result.get('track'):
                logger.warning("No track found in Shazam response")
                return None
                
            track = result['track']
            title = track.get('title', 'Unknown Title')
            artist = track.get('subtitle', 'Unknown Artist')
            
            # Get lyrics from lyrics.ovh
            lyrics = LyricsService.get_lyrics(artist, title)
            
            # Get album info
            album = ''
            for section in track.get('sections', []):
                if section.get('type') == 'SONG':
                    for metadata in section.get('metadata', []):
                        if metadata.get('title') == 'Album':
                            album = metadata.get('text', '')
                            break
            
            # Get album art
            album_art = None
            if 'images' in track:
                if 'coverarthq' in track['images']:
                    album_art = track['images']['coverarthq']
                elif 'coverart' in track['images']:
                    album_art = track['images']['coverart']
            
            response = {
                'title': title,
                'artist': artist,
                'album': album,
                'album_art': album_art,
                'lyrics': lyrics or [],
                'has_subtitles': bool(lyrics)
            }
            
            if lyrics:
                logger.info("Lyrics successfully retrieved")
            else:
                logger.warning("No lyrics found")
                
            return response
            
        except Exception as e:
            logger.error(f"Error in song recognition: {str(e)}")
            return None