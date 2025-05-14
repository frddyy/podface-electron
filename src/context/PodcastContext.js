import React, { createContext, useContext, useState, useEffect } from 'react';

// Buat context untuk menyimpan status merge podcast
const PodcastContext = createContext();

// Buat provider untuk PodcastContext
export const PodcastProvider = ({ children }) => {
  const [videoPodcastFile, setVideoPodcastFile] = useState(null);  // Menyimpan file hasil merge video dan audio
  const [isPodcastMerged, setIsPodcastMerged] = useState(false);   // Status apakah video podcast sudah berhasil digabung

  useEffect(() => {
    if (videoPodcastFile === null) {
      setIsPodcastMerged(false); // Set to false if videoFile1 is null
    } else {
      setIsPodcastMerged(true); // Set to true if videoFile1 is not null
    }
  }, [videoPodcastFile]); // Triggered when videoFile1 changes

  return (
    <PodcastContext.Provider
      value={{
        videoPodcastFile,
        setVideoPodcastFile,
        isPodcastMerged,
        setIsPodcastMerged,
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
};

// Hook untuk menggunakan context di komponen lain
export const usePodcastContext = () => {
  return useContext(PodcastContext);
};
