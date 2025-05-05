import React, { createContext, useContext, useState } from 'react';

// Buat context untuk Face Model
const FaceModelContext = createContext();

// Buat provider untuk FaceModelContext
export const FaceModelProvider = ({ children }) => {
  const [isUseTemplate1, setIsUseTemplate1] = useState(false); // Status template untuk Speaker 1
  const [isUseTemplate2, setIsUseTemplate2] = useState(false); // Status template untuk Speaker 2
  
  const [gender1, setGender1] = useState("male");
  const [template1, setTemplate1] = useState(1);

  const [gender2, setGender2] = useState("female");
  const [template2, setTemplate2] = useState(1);

  const [imageFile1, setImageFile1] = useState(null); // Image untuk Speaker 1
  const [reconstructedFile1, setReconstructedFile1] = useState(null); // File hasil rekonstruksi Speaker 1
  const [templateFile1, setTemplateFile1] = useState(null); // Template 3D untuk Speaker 1

  const [imageFile2, setImageFile2] = useState(null); // Image untuk Speaker 2
  const [reconstructedFile2, setReconstructedFile2] = useState(null); // File hasil rekonstruksi Speaker 2
  const [templateFile2, setTemplateFile2] = useState(null); // Template 3D untuk Speaker 2

  // State untuk menyimpan final face
  const [finalFace1, setFinalFace1] = useState(null); // Final face untuk Speaker 1
  const [finalFace2, setFinalFace2] = useState(null); // Final face untuk Speaker 2

  // Fungsi untuk menentukan final face berdasarkan kondisi
  const setFinalFace = () => {
    // Tentukan final face untuk speaker 1
    if (isUseTemplate1 && templateFile1) {
      setFinalFace1(templateFile1); // Gunakan template 3D untuk speaker 1
    } else {
      setFinalFace1(reconstructedFile1); // Gunakan image atau file hasil rekonstruksi
    }

    // Tentukan final face untuk speaker 2
    if (isUseTemplate2 && templateFile2) {
      setFinalFace2(templateFile2); // Gunakan template 3D untuk speaker 2
    } else {
      setFinalFace2(reconstructedFile2); // Gunakan image atau file hasil rekonstruksi
    }
  };

  return (
    <FaceModelContext.Provider
      value={{
        isUseTemplate1,
        setIsUseTemplate1,
        isUseTemplate2,
        setIsUseTemplate2,
        gender1,
        setGender1,
        template1,
        setTemplate1,
        gender2,
        setGender2,
        template2,
        setTemplate2,
        imageFile1,
        setImageFile1,
        reconstructedFile1,
        setReconstructedFile1,
        templateFile1,
        setTemplateFile1,
        imageFile2,
        setImageFile2,
        reconstructedFile2,
        setReconstructedFile2,
        templateFile2,
        setTemplateFile2,
        finalFace1,
        finalFace2,
        setFinalFace,
      }}
    >
      {children}
    </FaceModelContext.Provider>
  );
};

// Hook untuk menggunakan context di komponen lain
export const useFaceModelContext = () => {
  return useContext(FaceModelContext);
};
