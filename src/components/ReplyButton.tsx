import React, { useState, useCallback } from "react";

import {
  Button,
  CircularProgress
} from "@mui/material";

import { useLongPress, LongPressDetectEvents } from "use-long-press";
import { KeyboardVoiceOutlined } from "@mui/icons-material";

interface ReplyButtonProps {
  onHold: () => void;
  onRelease: () => void;
  onCancel: () => void;
  disabled?: boolean;
  transcribing: boolean;
}

export default function ReplyButton({
  onHold,
  onRelease,
  onCancel,
  disabled = false,
  transcribing = false,
}: ReplyButtonProps) {
  const [recording, setRecording] = useState(false);

  const callback = React.useCallback(() => {
    setRecording(true);
    onHold();
  }, []);
  const bind = useLongPress(callback, {
    //onStart: onHold,
    onFinish: () => { setRecording(false); onRelease(); },
    onCancel: () => { setRecording(false); onCancel(); } ,
    //onMove: () => console.log("Detected mouse or touch movement"),
    filterEvents: () => true, // All events can potentially trigger long press
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: false,
    detect: LongPressDetectEvents.BOTH
  });

  return (
    <Button
      {...bind("record")}
      variant="contained"
      color="primary"
      startIcon={<KeyboardVoiceOutlined />}
      sx={{
        position: "relative",
        width: 180,
        height: 40,
      }}
      disabled={disabled || transcribing}
    >
      {transcribing ? 'Transcribing...' : (recording ? 'Recording...' : 'Hold to Reply')}
    </Button>
  );
}