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
  const [isSeparationLoading, setIsSeparationLoading] = useState(false);
  const [isConvertion1Loading, setIsConvertion1Loading] = useState(false);
  const [isConvertion2Loading, setIsConvertion2Loading] = useState(false);

  // Fungsi untuk menentukan final audio berdasarkan kondisi
  const setFinalAudio = () => {
    // Tentukan final audio untuk speaker 1
    if (isConvertVoice1 && convertedFile1) {
      setFinalAudio1(convertedFile1); // Gunakan hasil konversi untuk speaker 1
    } else {
      setFinalAudio1({ path: separatedAudioFiles.speaker1 }); // Gunakan audio yang sudah dipisah
    }

    // Tentukan final audio untuk speaker 2
    if (isConvertVoice2 && convertedFile2) {
      setFinalAudio2(convertedFile2); // Gunakan hasil konversi untuk speaker 2
    } else {
      setFinalAudio2({ path: separatedAudioFiles.speaker2 }); // Gunakan audio yang sudah dipisah
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
        isSeparationLoading,
        setIsSeparationLoading,
        isConvertion1Loading,
        setIsConvertion1Loading,
        isConvertion2Loading,
        setIsConvertion2Loading,
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
