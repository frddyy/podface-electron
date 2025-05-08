import React, { createContext, useContext, useState } from "react";

// Buat context untuk render state
const RenderContext = createContext();

// Buat provider untuk RenderContext
export const RenderProvider = ({ children }) => {
  // State untuk menyimpan apakah animasi untuk speaker sudah dirender
  const [isSpeaker1Rendered, setIsSpeaker1Rendered] = useState(false);
  const [isSpeaker2Rendered, setIsSpeaker2Rendered] = useState(false);

  // State untuk menyimpan file video untuk masing-masing speaker
  const [videoFile1, setVideoFile1] = useState(null);
  const [videoFile2, setVideoFile2] = useState(null);

  return (
    <RenderContext.Provider
      value={{
        isSpeaker1Rendered,
        setIsSpeaker1Rendered,
        isSpeaker2Rendered,
        setIsSpeaker2Rendered,
        videoFile1,
        setVideoFile1,
        videoFile2,
        setVideoFile2,
      }}
    >
      {children}
    </RenderContext.Provider>
  );
};

// Hook untuk menggunakan context di komponen lain
export const useRenderContext = () => {
  return useContext(RenderContext);
};
