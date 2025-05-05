import React, { useEffect } from "react";
import { useAudioContext } from "../context/AudioContext";
import { useFaceModelContext } from "../context/FaceModelContext";

const AnimateRenderScreen = () => {
  const { finalAudio1, finalAudio2 } = useAudioContext(); // Ambil final audio dari context
  const { finalFace1, finalFace2 } = useFaceModelContext(); // Ambil final face dari context

  // useEffect untuk memantau perubahan final audio
  useEffect(() => {
    console.log("Final Audio Speaker 1:", finalAudio1);
    console.log("Final Audio Speaker 2:", finalAudio2);
    console.log("Final Face Speaker 1:", finalFace1);
    console.log("Final Face Speaker 2:", finalFace2);
  }, [finalAudio1, finalAudio2, finalFace1, finalFace2]); 

  return (
    <div>AnimateRenderScreen</div>
  )
}

export default AnimateRenderScreen