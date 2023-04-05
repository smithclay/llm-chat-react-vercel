export default async function handleVoiceUpload(blob: Blob): Promise<string> {
  const file = new File([blob], "speech.mp3", {
    type: "audio/mpeg",
  });

  const body = new FormData();
  body.append("file", file);

  const { default: axios } = await import("axios");
  const headers = { "Content-Type": "multipart/form-data" };

  const response = await axios.post("/api/whisper", body, { headers });

  if (response.status !== 200) {
    throw new Error(`Request failed with status code ${response.status}`);
  }

  const { text } = await response.data;
  return text;
}
