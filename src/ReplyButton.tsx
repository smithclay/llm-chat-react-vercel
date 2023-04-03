import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { KeyboardVoiceOutlined } from "@mui/icons-material";
import React, { useState } from "react";

interface ReplyButtonProps {
  onHold: () => void;
  onRelease: () => void;
  disabled?: boolean;
}

export default function ReplyButton({
  onHold = () => {},
  onRelease = () => {},
  disabled = false,
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
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {showProgress ? <CircularProgress size={24} /> : "Hold to Reply"}
    </Button>
  );
}
