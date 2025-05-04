import React, { useEffect } from "react";
import { useAudioContext } from "../context/AudioContext";

const AnimateRenderScreen = () => {
  const { finalAudio1, finalAudio2 } = useAudioContext(); // Ambil final audio dari context

  // useEffect untuk memantau perubahan final audio
  useEffect(() => {
    console.log("Final Audio Speaker 1:", finalAudio1);
    console.log("Final Audio Speaker 2:", finalAudio2);
  }, [finalAudio1, finalAudio2]); 

  return (
    <div>AnimateRenderScreen</div>
  )
}

export default AnimateRenderScreen