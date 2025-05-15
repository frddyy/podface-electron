import React, { createContext, useContext, useState, useEffect } from "react";

// Buat context untuk render state
const RenderContext = createContext();

// Buat provider untuk RenderContext
export const RenderProvider = ({ children }) => {
  // State untuk menyimpan apakah animasi untuk speaker sudah dirender
  const [isSpeaker1Rendered, setIsSpeaker1Rendered] = useState(false);
  const [isSpeaker2Rendered, setIsSpeaker2Rendered] = useState(false);

  const [isRendering1Loading, setIsRendering1Loading] = useState(false);
  const [isRendering2Loading, setIsRendering2Loading] = useState(false);

  // State untuk menyimpan file video untuk masing-masing speaker
  const [videoFile1, setVideoFile1] = useState(null);
  const [videoFile2, setVideoFile2] = useState(null);

  useEffect(() => {
    if (videoFile1 === null) {
      setIsSpeaker1Rendered(false); // Set to false if videoFile1 is null
    } else {
      setIsSpeaker1Rendered(true); // Set to true if videoFile1 is not null
    }
  }, [videoFile1]); // Triggered when videoFile1 changes

  useEffect(() => {
    if (videoFile2 === null) {
      setIsSpeaker2Rendered(false); // Set to false if videoFile2 is null
    } else {
      setIsSpeaker2Rendered(true); // Set to true if videoFile2 is not null
    }
  }, [videoFile2]); // Triggered when videoFile2 changes

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
        isRendering1Loading, 
        setIsRendering1Loading,
        isRendering2Loading, 
        setIsRendering2Loading
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
