class TextSpeaker {

  constructor() {
  }

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

