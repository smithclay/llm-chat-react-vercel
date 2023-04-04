import React, { useState } from "react";
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

import { ChatBubbleOutline, LocalConvenienceStoreOutlined } from "@mui/icons-material";
import Chat, { Bubble, useMessages } from "@chatui/core";
import { useWhisper } from "@chengsokdara/use-whisper";
import ReplyButton from "./ReplyButton";
import { WebTextSpeaker } from "./TextSpeaker";
import "@chatui/core/dist/index.css";

export default function App() {
  const { messages, appendMsg, setTyping } = useMessages([]);
  const [speakResponse, setSpeakResponse] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle the transcription of the audio blob with custom backend
  // This is so we don't expose our API key to the client
  const onTranscribe = async (blob: Blob) => {
    const file = new File([blob], "speech.mp3", {
      type: "audio/mpeg",
    });
    const body = new FormData();
    body.append("file", file);
    const { default: axios } = await import("axios");
    const headers = { "Content-Type": "multipart/form-data" };
    try {
      const response = await axios.post("/api/whisper", body, { headers });
      if (response.status !== 200) {
        throw new Error(`Request failed with status code ${response.status}`);
      }
      const { text } = await response.data;
      console.log("Got transcription:", text);
      await handleSend("text", text);

      return {
        blob,
        text,
      };
    } catch (error) {
      console.error(error);
    }
    return {
      blob,
      text: "",
    };
  };

  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    onTranscribe,
    removeSilence: true,
    nonStop: false,
  });

  const sendChat = async (text: string): Promise<string> => {
    let reply = "";

    try {
      setLoading(true);

      const history = messages.map((message) => {
        const author = message.position === "left" ? "System" : "Human";
        return `${author}: ${message.content.text}`;
      });

      const historyEncoded = encodeURIComponent(history.join("\n"));
      const textEncoded = encodeURIComponent(text);
      const url = `/api?text=${textEncoded}&history=${historyEncoded}`;

      const response = await fetch(url);
      reply = await response.text();

      appendMsg({
        type: "text",
        content: { text: reply },
        position: "left",
      });

      const speaker = new WebTextSpeaker(reply);
      if (speakResponse) {
        speaker.speak();
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }

    return reply;
  };

  const handleStartButtonClick = async () => {
    await sendChat("");
    setShowChat(true);
  };

  const handleSend = async (type: string, val: string) => {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);
      await sendChat(val);
    }
  };

  function renderMessageContent(msg: any) {
    const { content } = msg;
    return <Bubble content={content.text} />;
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">🤖 LLM Chat</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Grid container spacing={2} sx={{ my: 4 }}>
          {!showChat && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Click the button to start a chat with a LLM bot.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<ChatBubbleOutline />}
                  disabled={loading}
                  onClick={handleStartButtonClick}
                >
                  {loading ? "Loading..." : "Start Chat"}
                </Button>
              </Grid>
            </>
          )}

          {showChat && (
            <>
              {error && (
                <Grid item xs={12}>
                  <Typography variant="h6">Error: {error}</Typography>
                </Grid>
              )}

              <Grid item xs={12} sx={{ height: "400px" }}>
                <Chat
                  messages={messages}
                  locale="en-US"
                  placeholder="Type here..."
                  renderMessageContent={renderMessageContent}
                  onSend={handleSend}
                />
              </Grid>

              <Grid item xs={12}>
                <ReplyButton
                  transcribing={transcribing}
                  onHold={startRecording}
                  onRelease={stopRecording}
                />
                <Button
                  sx={{ marginLeft: "12px" }}
                  onClick={() => {
                    setShowChat(false);
                  }}
                >
                  End Chat
                </Button>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Options</FormLabel>

                  <FormGroup row aria-label="position">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={speakResponse}
                          onChange={(e) => {
                            setSpeakResponse(e.target.checked);
                          }}
                        />
                      }
                      label="Speak responses"
                      labelPlacement="end"
                      value="speak"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </div>
  );
}
