import azure.functions as func
import json
import tempfile
import os
import logging
from mutagen import File
from shazam_service import ShazamService

async def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    try:
        # Get the file from the request
        file_data = req.get_body()
        
        if not file_data:
            return func.HttpResponse(
                "No audio file received",
                status_code=400
            )
            
        # Save to temp file
        temp_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
                temp_file.write(file_data)
                temp_path = temp_file.name
                
            # Check audio duration
            audio = File(temp_path)
            if audio is None:
                raise ValueError("Could not read audio file")
            
            duration = audio.info.length
            if duration > 20:
                return func.HttpResponse(
                    "Audio file too long. Maximum duration is 20 seconds",
                    status_code=400
                )
                
            # Initialize Shazam service and recognize song
            shazam_service = ShazamService()
            result = await shazam_service.recognize_song(temp_path)
            
            if not result:
                return func.HttpResponse(
                    json.dumps({
                        "title": "Unknown Song",
                        "artist": "Unknown Artist",
                        "album": "",
                        "album_art": "",
                        "lyrics": [],
                        "has_subtitles": False
                    }),
                    mimetype="application/json",
                    status_code=200
                )
            
            return func.HttpResponse(
                json.dumps(result),
                mimetype="application/json",
                status_code=200
            )
            
        finally:
            # Cleanup
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception as e:
                    logging.error(f"Error cleaning up: {str(e)}")
                    
    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return func.HttpResponse(
            str(e),
            status_code=500
        )
