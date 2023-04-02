import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { ChatBubbleOutline } from "@mui/icons-material";
import Chat, { Bubble, useMessages } from "@chatui/core";
import "@chatui/core/dist/index.css";

export default function App() {
  const { messages, appendMsg, setTyping } = useMessages([]);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendChat = async (text: string, history: string) => {
    let reply = "";
    try {
      setLoading(true);

      const history = messages.map((m) =>
        m.position === "left"
          ? `System: ${m.content.text}`
          : `Human: ${m.content.text}`
      );

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
      
      // TODO: This voice seems very unnatural. Find a better one.
      const utterance = new SpeechSynthesisUtterance(reply);
      (window as any).speechSynthesis.speak(utterance);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
    return reply;
  };

  const handleStartButtonClick = async () => {
    await sendChat("", "");
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
      await sendChat(val, "");
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
        <Grid container sx={{ my: 4 }} spacing={2}>
          {!showChat && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Click the button to start a your chat with a LLM bot.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  startIcon={<ChatBubbleOutline />}
                  variant="contained"
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
              {error && <Typography variant="h6">Error: {error}</Typography>}
              <Grid item sx={{ height: "400px" }} xs={12}>
                <Chat
                  messages={messages}
                  locale="en-US"
                  placeholder="Type here..."
                  renderMessageContent={renderMessageContent}
                  onSend={handleSend}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Options</FormLabel>
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="speak"
                      control={<Checkbox defaultChecked />}
                      label="Speak responses"
                      labelPlacement="end"
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
