"""
Services package for song identification and lyrics retrieval.
Contains ShazamService and LyricsService modules.
"""

from .shazam_service import ShazamService
from .lyrics_service import LyricsService

__all__ = ['ShazamService', 'LyricsService'] 