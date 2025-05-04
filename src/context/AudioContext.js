import React, { createContext, useContext, useState } from 'react';

// Buat context untuk audio
const AudioContext = createContext();

// Buat provider untuk AudioContext
export const AudioProvider = ({ children }) => {
  const [fileAudioPodcast, setFileAudioPodcast] = useState(null);  // Menyimpan file input audio podcast
  const [separatedAudioFiles, setSeparatedAudioFiles] = useState({}); // Menyimpan hasil pemisahan audio
  const [isConvertVoice1, setIsConvertVoice1] = useState(false); // Status konversi suara Speaker 1
  const [isConvertVoice2, setIsConvertVoice2] = useState(false); // Status konversi suara Speaker 2
  const [finalAudio1, setFinalAudio1] = useState(null); // Final audio untuk Speaker 1
  const [finalAudio2, setFinalAudio2] = useState(null); // Final audio untuk Speaker 2
  const [fileAudioReference1, setFileAudioReference1] = useState(null); // File untuk Speaker 1 (referensi konversi)
  const [fileAudioReference2, setFileAudioReference2] = useState(null); // File untuk Speaker 2 (referensi konversi)
  const [convertedFile1, setConvertedFile1] = useState(null); // File hasil konversi Speaker 1
  const [convertedFile2, setConvertedFile2] = useState(null); // File hasil konversi Speaker 2

  // Fungsi untuk set final audio berdasarkan apakah konversi suara dilakukan
  const setFinalAudio = (convertedAudio1, separatedAudio1) => {
    if (isConvertVoice1) {
      setFinalAudio1(convertedAudio1); // Jika voice conversion diaktifkan
    } else {
      setFinalAudio1(separatedAudio1); // Jika tidak, gunakan audio yang sudah dipisah
    }
  };

  return (
    <AudioContext.Provider
      value={{
        fileAudioPodcast,
        setFileAudioPodcast,
        separatedAudioFiles,
        setSeparatedAudioFiles,
        isConvertVoice1,
        setIsConvertVoice1,
        isConvertVoice2,
        setIsConvertVoice2,
        finalAudio1,
        setFinalAudio1,
        finalAudio2,
        setFinalAudio2,
        setFinalAudio,
        fileAudioReference1,
        setFileAudioReference1,
        fileAudioReference2,
        setFileAudioReference2,
        convertedFile1,
        setConvertedFile1,
        convertedFile2,
        setConvertedFile2,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

// Hook untuk menggunakan context di komponen lain
export const useAudioContext = () => {
  return useContext(AudioContext);
};
