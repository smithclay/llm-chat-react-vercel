export enum TextToSpeechProvider {
  ELEVEN_LABS = "eleven_labs",
}

export async function handleTextToSpeech(
  text: string,
  provider: TextToSpeechProvider
): Promise<string> {
  const textEncoded = encodeURIComponent(text);
  let url = "";

  switch (provider) {
    case TextToSpeechProvider.ELEVEN_LABS:
      url = `/api/tts?text=${textEncoded}&provider=${TextToSpeechProvider.ELEVEN_LABS}`;
      break;
    default:
      throw new Error("Invalid text-to-speech provider specified");
  }

  const response = await fetch(url);
  const base64_audio = await response.text();

  return base64_audio;
}
