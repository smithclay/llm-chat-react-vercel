import requests
import os
import base64
import logging

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from urllib.parse import urlparse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

VOICE_ID = os.environ.get('ELEVEN_VOICE_ID', '21m00Tcm4TlvDq8ikWAM')
ELEVEN_API_KEY = os.environ.get('ELEVEN_API_KEY', '')

def text_to_speech(text):
    """Converts text to speech using remote API."""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    response = requests.post(url,
                             headers={
                                 'xi-api-key': ELEVEN_API_KEY,
                                 'accept': 'audio/mpeg',
                                 'Content-Type': 'application/json'
                             },
                             json={
                                 "text": text,
                                 "voice_settings": {
                                     "stability": 0,
                                     "similarity_boost": 0
                                 }
                             },
                             timeout=120)

    if response.status_code == 200:
        b = base64.b64encode(response.content) # bytes
        return b.decode('utf-8')
    else:
        return None

ELEVEN_PROVIDER = 'eleven_labs'

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handles GET requests."""
        o = urlparse(self.path)
        params = parse_qs(o.query)

        logging.info(f'Got GET request: {o.path}')
        if 'text' in params and ('provider' in params and params['provider'][0] == ELEVEN_PROVIDER):
            b64 = text_to_speech(params['text'][0])
            if b64 is not None:
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b64.encode('utf-8'))
            else:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write('Error'.encode('utf-8'))
        else:
            logging.info(f'Params not found: {params}')
            self.send_response(400)
            self.wfile.write('param not found'.encode('utf-8'))
            self.end_headers()
        return