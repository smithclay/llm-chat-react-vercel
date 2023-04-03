import logging
import openai
import os
import json
import cgi

from http.server import BaseHTTPRequestHandler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

openai.api_key = os.environ['OPENAI_API_KEY']

FILE_TOO_SMALL_SIZE = 1000


class Handler(BaseHTTPRequestHandler):
    def transcribe(self, file):
        return openai.Audio.transcribe(model="whisper-1", file=file)

    def do_POST(self):
        content_type, _ = cgi.parse_header(self.headers.get('content-type'))

        if content_type != 'multipart/form-data':
            # Unsupported content type
            self.send_response(415)
            self.end_headers()
            self.wfile.write(b'Unsupported media type')
            return

        # Parse multipart form data fields
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST'}
        )
        file_field = form.getfirst('file')

        logging.info(f'Received audio file of length: {len(file_field)}')

        if len(file_field) < FILE_TOO_SMALL_SIZE:
            self.send_response(400)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(b'File too small')
            return

        with open('/tmp/speech.mp3', 'wb') as f:
            f.write(file_field)

        with open('/tmp/speech.mp3', 'rb') as f:
            response = self.transcribe(file=f)
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
