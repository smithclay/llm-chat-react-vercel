# LLM Chat with React, OpenAI, and Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsmithclay%2Fllm-chat-react-vercel&env=OPENAI_API_KEY&envDescription=API%20Keys%20needed)

<img src="https://raw.githubusercontent.com/smithclay/llm-chat-react-vercel/main/screenshot.png" title="screenshot" alt="screenshot" width="200" />


This is an example of a conversational (with voice!) React app that calls a simple serverless backend written in Python. 

The backend automatically gets deployed to appropraite endpoint if using [Vercel](https://vercel.com). Use the "Deploy" button above to deploy it to your own project.

## Setup

* You will need an OpenAI API token set to the `OPENAI_API_KEY` env variable. This app uses the GPT-4 model.
* If have `gpt-4` API access, set the `OPENAI_API_MODEL` env var to `gpt-4`, otherwise it will use `gpt-3.5-turbo`.

```bash
npm install
```

## Running locally

```bash
# This starts the backend
npm i -g vercel
vercel dev
```

## Deploying

```bash
# Only need to set the key once
vercel env add OPENAI_API_KEY
vercel deploy
```