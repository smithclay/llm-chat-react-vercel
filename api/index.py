import logging
import openai
import os

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from urllib.parse import urlparse

from langchain.chat_models import ChatOpenAI
from langchain import PromptTemplate, LLMChain
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)


_PROMPT_TEMPLATE = """You are a human at a party and speaking with another person you don't know very well. 
Your should make pleasant conversation to know the other person better.
You should only ask the other person one question at a time.

Conversation history: 
{history}
----
"""

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)

def build_prompt(template):
    """Builds a prompt template for the chatbot."""
    system_message_prompt = SystemMessagePromptTemplate.from_template(template)
    human_template = "{text}"
    human_message_prompt = HumanMessagePromptTemplate.from_template(
        human_template)

    return ChatPromptTemplate.from_messages(
        [system_message_prompt, human_message_prompt])


def format_history(self, history):
    """Formats the history for the prompt."""
    output = ""
    for chat in history:
        human, system = chat
        output = output + f"Human: {human}\nSystem: {system}\n"
    return output


PROMPT = build_prompt(_PROMPT_TEMPLATE)

chat = ChatOpenAI(temperature=0, model='gpt-4')
openai.api_key = os.environ['OPENAI_API_KEY']

class handler(BaseHTTPRequestHandler):
    def get_reply(self, text, history):
        logging.info('Calling LLM...')
        messages = PROMPT.format_prompt(history=history, text=text).to_messages()
        output = chat(messages)
        logging.info(f'Got LLM output: {output.content}')
        return output.content

    def transcribe(self):
        pass
    
    def do_POST(self):
        o = urlparse(self.path)
        params = parse_qs(o.query)
        if o.path == '/api/whisper':
            # parse base64 audio file
            content_len = int(self.headers.get('Content-Length'))
            post_body = self.rfile.read(content_len)
            req_json = json.loads(post_body)
            file_base64 = req_json['file']
            # create file from base64 string
            decoded_bytes = base64.b64decode(base64_string)

            # Create file object from decoded bytes
            file_object = open('file.txt', 'wb')
            file_object.write(decoded_bytes)
            file_object.close()

            logging.info(f'Transcribing audio file...')
            transcript = openai.Audio.transcribe(model="whisper-1", file=file_object)
            logging.info(f'Got transcript: {json.dumps(transcript)}')
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            json_string = json.dumps(transcript)
            self.wfile.write(json_string.encode('utf-8'))
        else:
            logging.info(f'Path not found: {o.path}')
            self.send_response(404)
            self.wfile.write('not found'.encode('utf-8'))
            self.end_headers()
        return    
    
    def do_GET(self):
        o = urlparse(self.path)
        params = parse_qs(o.query)
        
        logging.info(f'Got GET request: {o.path}')
        if o.path == '/api':
            text = '' if 'text' not in params else params['text'][0]
            history = '' if 'history' not in params else params['history'][0]

            logging.info(f'Got query params: {params}')

            reply = self.get_reply(text, history)
            
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()       
            self.wfile.write(reply.encode('utf-8'))     
        else:
            logging.info(f'Path not found: {o.path}')
            self.send_response(404)
            self.wfile.write('not found'.encode('utf-8'))
            self.end_headers()
        return
