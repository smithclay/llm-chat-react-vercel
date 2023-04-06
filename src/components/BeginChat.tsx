import React from "react";
import { Typography, Button, Grid } from "@mui/material";
import { ChatBubbleOutline } from "@mui/icons-material";

interface MyComponentProps {
  loading: boolean;
  onClick: () => void;
}

// This is a workaround to enable TTS on iOS devices.
const enableAutoTTS = () => {
  if (typeof window === "undefined") {
    return;
  }
  const isiOS =
    navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  if (!isiOS) {
    return;
  }
  const simulateSpeech = () => {
    const lecture = new SpeechSynthesisUtterance("hello");
    lecture.volume = 0;
    speechSynthesis.speak(lecture);
    document.removeEventListener("click", simulateSpeech);
  };

  document.addEventListener("click", simulateSpeech);
};

const BeginChat: React.FC<MyComponentProps> = ({ loading, onClick }) => {
  return (
    <>
      <Typography variant="h6">
        Click the button to start a chat with a LLM bot.
      </Typography>
      <Button
        variant="contained"
        startIcon={<ChatBubbleOutline />}
        disabled={loading}
        onClick={() => {
          enableAutoTTS();
          onClick();
        }}
        sx={{ marginTop: "12px" }}
      >
        {loading ? "Loading..." : "Start Chat"}
      </Button>
    </>
  );
};

export default BeginChat;
