import { handleTextToSpeech, TextToSpeechProvider} from "./utils/handleTextToSpeech";

class TextSpeaker {
  public async speak(text: string): Promise<void>  {
    console.log(text);
  }
}

export class WebTextSpeaker extends TextSpeaker {
  public async speak(text: string): Promise<void>  {
    const utterance = new SpeechSynthesisUtterance(text);
    (window as any).speechSynthesis.speak(utterance);
  }
}

export class ElevenLabsTextSpeaker extends TextSpeaker {
  public async speak(text: string): Promise<void>  {
    const base64_audio = await handleTextToSpeech(text, TextToSpeechProvider.ELEVEN_LABS);
    const audioElement = new Audio();
    audioElement.src = `data:audio/mp3;base64,${base64_audio}`;
    // Play the audio element
    audioElement.play();
  }
}

