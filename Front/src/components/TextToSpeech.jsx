import React from "react";
import { Button } from "@mui/material";

const TextToSpeech = ({ text }) => {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={speak}
      aria-label="Listen to results"
    >
      Listen
    </Button>
  );
};

export default TextToSpeech;
