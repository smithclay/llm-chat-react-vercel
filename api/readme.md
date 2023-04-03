# LLM Chat Backend

Simple python API backend that calls OpenAI for the frontend.

Also comes with a notebook for easy testig.

## Endpoints

* `/api` - Reply to input text from the LLM
* `/api/whisper` - Transcribe audio

## Environment Variables

These endpoints expects the OPENAI_API_KEY environment variable to be set with a valid OpenAI API key.

In Vercel, they can be added with the `vercel` CLI:

```bash
    vercel env add OPENAI_API_KEY
```