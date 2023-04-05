import React from 'react';
import { FormControl, FormControlLabel, FormLabel, FormGroup, Checkbox } from '@mui/material';

interface MyComponentProps {
  speakResponse: boolean;
  onSpeakResponseChecked: (checked: boolean) => void;
}

const ChatOptions: React.FC<MyComponentProps> = ({ speakResponse, onSpeakResponseChecked }) => {
  return (
    <FormControl component="fieldset">
    <FormLabel component="legend">Options</FormLabel>

    <FormGroup row aria-label="position">
      <FormControlLabel
        control={
          <Checkbox
            checked={speakResponse}
            onChange={(e) => {
                onSpeakResponseChecked(e.target.checked);
            }}
          />
        }
        label="Speak responses"
        labelPlacement="end"
        value="speak"
      />
    </FormGroup>
  </FormControl>
  );
};

export default ChatOptions;