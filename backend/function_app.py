import azure.functions as func
import logging
import json
from services.shazam_service import ShazamService
from services.lyrics_service import LyricsService

app = func.FunctionApp()

@app.function_name(name="identify")
@app.route(route="identify", auth_level=func.AuthLevel.FUNCTION)
async def identify(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Handle CORS preflight request
    if req.method == "OPTIONS":
        return func.HttpResponse(
            status_code=200,
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            }
        )

    try:
        # Get the file from form data
        file_data = None
        for name, file in req.files.items():
            if name == 'file':
                file_data = file.read()
                break

        if not file_data:
            return func.HttpResponse(
                json.dumps({
                    "error": "Please pass an audio file in the request body"
                }),
                mimetype="application/json",
                status_code=400
            )

        # Initialize services
        shazam_service = ShazamService()
        lyrics_service = LyricsService()

        # Identify the song
        song_info = await shazam_service.identify_song(file_data)
        if not song_info:
            return func.HttpResponse(
                json.dumps({
                    "error": "Could not identify the song"
                }),
                mimetype="application/json",
                status_code=404
            )

        # Get lyrics if available
        lyrics = await lyrics_service.get_lyrics(song_info)
        
        # Combine results
        result = {
            "song": {
                "title": song_info.get('title'),
                "artist": song_info.get('artist'),
                "album": song_info.get('album'),
                "artwork": song_info.get('artwork')
            },
            "lyrics": lyrics if lyrics else []
        }

        return func.HttpResponse(
            body=json.dumps(result),
            mimetype="application/json",
            status_code=200,
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        )

    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return func.HttpResponse(
            json.dumps({
                "error": "An error occurred while processing your request",
                "details": str(e)
            }),
            mimetype="application/json",
            status_code=500
        )