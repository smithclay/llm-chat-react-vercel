export default async function fetchReply(messages: any[], text: string): Promise<string> {
  const history = messages.map((message) => {
    const author = message.position === "left" ? "System" : "Human";
    return `${author}: ${message.content.text}`;
  });

  const historyEncoded = encodeURIComponent(history.join("\n"));
  const textEncoded = encodeURIComponent(text);
  const url = `/api?text=${textEncoded}&history=${historyEncoded}`;

  const response = await fetch(url);
  const reply = await response.text();

  return reply;
}