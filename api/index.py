import logging
import openai
import os

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from urllib.parse import urlparse

from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)


_PROMPT_TEMPLATE = """You are a friendly and funny human at a party and speaking with another person you don't know very well.
You should make pleasant conversation to know the other person better.
You should only ask the other person one question at a time. Use casual, informal language.

If the other person asks you a question, you should answer it in a funny way. Don't tell the other person you are an AI or LLM.

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
    for dialogue in history:
        human, system = dialogue
        output = output + f"Human: {human}\nSystem: {system}\n"
    return output


PROMPT = build_prompt(_PROMPT_TEMPLATE)

# Set to gpt-4 if you have access to it.
model_type = os.getenv('OPENAI_API_MODEL', 'gpt-3.5-turbo')
chat = ChatOpenAI(temperature=0, model=model_type)
openai.api_key = os.environ['OPENAI_API_KEY']
logging.info(f'Using model: {model_type}')

class handler(BaseHTTPRequestHandler):
    def get_reply(self, text, history):
        """Gets a reply from the chatbot."""
        logging.info('Calling LLM...')
        messages = PROMPT.format_prompt(
            history=history, text=text).to_messages()
        output = chat(messages)
        logging.info(f'Got LLM output: {output.content}')
        return output.content

    def do_GET(self):
        """Handles GET requests."""
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
