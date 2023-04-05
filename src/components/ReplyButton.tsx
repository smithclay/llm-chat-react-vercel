import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { KeyboardVoiceOutlined } from "@mui/icons-material";
import React, { useState } from "react";

interface ReplyButtonProps {
  onHold: () => void;
  onRelease: () => void;
  disabled?: boolean;
  transcribing: boolean;
}

export default function ReplyButton({
  onHold = () => {},
  onRelease = () => {},
  disabled = false,
  transcribing = false,
}: ReplyButtonProps) {
  const [showProgress, setShowProgress] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) {
      onHold();
      setShowProgress(true);
    }
  };

  const handleMouseUp = () => {
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
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
    >
      {showProgress || transcribing ? (
        <CircularProgress size={24} />
      ) : (
        "Hold to Reply"
      )}
    </Button>
  );
}
