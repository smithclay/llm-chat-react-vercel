import React, { useState, useRef } from "react";

import {
  Button,
  CircularProgress
} from "@mui/material";

import { KeyboardVoiceOutlined } from "@mui/icons-material";

interface ReplyButtonProps {
  onHold: () => void;
  onRelease: () => void;
  disabled?: boolean;
  transcribing: boolean;
}

export default function ReplyButton({
  onHold,
  onRelease,
  disabled = false,
  transcribing = false,
}: ReplyButtonProps) {
  const [showProgress, setShowProgress] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handlePressStart = () => {
    if (!disabled) {
      timeoutRef.current = setTimeout(() => {
        setShowProgress(true);
        onHold();
      }, 500);
    }
  };

  const handlePressEnd = () => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (showProgress) {
      setShowProgress(false);
      onRelease();
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<KeyboardVoiceOutlined />}
      sx={{
        position: "relative",
        width: 180,
        height: 40,
      }}
      disabled={disabled || transcribing}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
    >
      {transcribing ? (
        "Transcribing..."
      ) : showProgress ? (
        <CircularProgress size={24} />
      ) : (
        "Hold to Reply"
      )}
    </Button>
  );
}