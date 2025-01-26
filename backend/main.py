from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import logging
import tempfile
from typing import Optional, List
from pydantic import BaseModel
import mutagen
from shazam_service import ShazamService

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('app.log', mode='w')
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="LyricSync")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class SongResponse(BaseModel):
    title: str
    artist: str
    album: str
    album_art: Optional[str] = None
    lyrics: Optional[List[str]] = []
    has_subtitles: Optional[bool] = False

def check_audio_duration(file_path: str) -> float:
    """Check audio file duration."""
    try:
        audio = mutagen.File(file_path)
        if audio is None:
            raise ValueError("Could not read audio file")
        duration = audio.info.length
        return duration
    except Exception as e:
        logger.error(f"Error checking audio duration: {str(e)}")
        raise ValueError("Could not determine audio duration")

def save_temp_file(content: bytes, original_filename: str) -> str:
    """Save uploaded content to a temporary file."""
    suffix = '.webm'  # We're receiving webm from the frontend
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(content)
        return temp_file.name

@app.post("/api/identify", response_model=SongResponse)
async def identify_song(file: UploadFile = File(...)):
    """Process uploaded audio file and identify the song."""
    logger.info(f"Received file: {file.filename}")
    
    temp_path = None
    try:
        content = await file.read()
        file_size = len(content)
        logger.info(f"File size: {file_size} bytes")
        
        if file_size == 0:
            raise HTTPException(status_code=400, detail="Empty file received")
        
        # Save uploaded file
        temp_path = save_temp_file(content, file.filename)
        logger.info(f"Saved file to: {temp_path}")
        
        # Check duration
        try:
            duration = check_audio_duration(temp_path)
            if duration > 20:
                raise HTTPException(
                    status_code=400, 
                    detail="Audio file too long. Maximum duration is 20 seconds"
                )
            logger.info(f"Audio duration: {duration} seconds")
        except ValueError as e:
            logger.error(f"Duration check failed: {str(e)}")
        
        # Initialize Shazam service and recognize song
        shazam_service = ShazamService()
        result = await shazam_service.recognize_song(temp_path)
        
        if not result:
            return SongResponse(
                title="Unknown Song",
                artist="Unknown Artist",
                album="",
                album_art="",
                lyrics=[],
                has_subtitles=False
            )
        
        # Log the result for debugging
        logger.debug(f"Shazam result: {result}")
        
        return SongResponse(**result)
            
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        # Cleanup
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                logger.info("Cleaned up temporary file")
            except Exception as e:
                logger.error(f"Error cleaning up: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Service is running"}