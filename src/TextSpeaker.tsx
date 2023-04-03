class TextSpeaker {
  protected text: string;

  constructor(text: string) {
    this.text = text;
  }

  public async speak(): Promise<void>  {
    console.log(this.text);
  }
}

export class WebTextSpeaker extends TextSpeaker {
  public async speak(): Promise<void>  {
    const utterance = new SpeechSynthesisUtterance(this.text);
    (window as any).speechSynthesis.speak(utterance);
  }
}
