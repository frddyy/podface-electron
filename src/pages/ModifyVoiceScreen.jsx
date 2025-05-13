import React, { useState, useEffect } from "react";
import { Grid, Typography, Divider, Switch, Button, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomField from "../components/CustomField";
import { useAudioContext } from "../context/AudioContext";

const ModifyVoiceScreen = () => {
  const theme = useTheme();

  const {
    isConvertVoice1, setIsConvertVoice1,
    isConvertVoice2, setIsConvertVoice2,
    fileAudioReference1, setFileAudioReference1,
    fileAudioReference2, setFileAudioReference2,
    convertedFile1, setConvertedFile1,
    convertedFile2, setConvertedFile2,
    separatedAudioFiles,
    setFinalAudio
  } = useAudioContext(); // Ambil context dari AudioContext

  const [snackbarOpen, setSnackbarOpen] = useState(false);  
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    console.log("Converted file 1:", convertedFile1);
  }, [convertedFile1]); 

  // Fungsi untuk menangani perubahan pada switch
  const handleSwitchChange1 = (event) => {
    setIsConvertVoice1(event.target.checked);
  };

  const handleSwitchChange2 = (event) => {
    setIsConvertVoice2(event.target.checked);
  };

  // Fungsi untuk membuka file dialog dan memilih file audio
  const handleOpenFileDialog1 = () => {
    const { ipcRenderer } = window.require("electron");

    ipcRenderer.send("open-audio-file-dialog");

    ipcRenderer.once("audio-file-selected", (event, data) => {
      const audioURL = data.audioFilePath; // Object URL received from main process
      console.log("Received audio URL: ", audioURL);
      setFileAudioReference1({ path: audioURL });
    });

    ipcRenderer.once("invalid-audio-file", (event, data) => {
      // If the file is invalid, show an error message in Snackbar
      setSnackbarMessage(data.message);
      setSnackbarOpen(true);
    });
  };

  const handleOpenFileDialog2 = () => {
    const { ipcRenderer } = window.require("electron");

    ipcRenderer.send("open-audio-file-dialog");

    ipcRenderer.once("audio-file-selected", (event, data) => {
      const audioURL = data.audioFilePath; // Object URL received from main process
      console.log("Received audio URL: ", audioURL);
      setFileAudioReference2({ path: audioURL });
    });

    ipcRenderer.once("invalid-audio-file", (event, data) => {
      // If the file is invalid, show an error message in Snackbar
      setSnackbarMessage(data.message);
      setSnackbarOpen(true);
    });
  };

  // Fungsi yang dipanggil saat tombol Apply diklik untuk Speaker 1
  const handleApplyClick1 = () => {
    console.log("Applying voice conversion for Speaker 1...");

    if (fileAudioReference1) {
      const { ipcRenderer } = window.require("electron");

      // Path input (enhanced speaker audio) and target audio (from file dialog)
      const inputAudioPath = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/enhanced_speaker_1.wav"; 
      const targetAudioPath = fileAudioReference1.path;
      const outputAudioPath = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/converted_speaker_1.wav"; 

      // Mengirimkan informasi ke backend untuk menjalankan konversi suara
      ipcRenderer.send("voice-conversion", {
        inputAudioPath,
        targetAudioPath,
        outputAudioPath,
        speaker: "speaker_1" // Menambahkan informasi speaker (dynamic)
      });

      // Mendengarkan feedback setelah konversi selesai
      ipcRenderer.once("voice-conversion-complete", (event, data) => {
        console.log("Conversion feedback:", data);
        setConvertedFile1({ path: data.convertedAudioPaths.speaker1 }); // Menyimpan path hasil konversi
      });
    }
  };

  // Fungsi yang dipanggil saat tombol Apply diklik untuk Speaker 2
  const handleApplyClick2 = () => {
    console.log("Applying voice conversion for Speaker 2...");

    if (fileAudioReference2) {
      const { ipcRenderer } = window.require("electron");

      // Path input (enhanced speaker audio) and target audio (from file dialog)
      const inputAudioPath = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/enhanced_speaker_2.wav"; 
      const targetAudioPath = fileAudioReference2.path;
      const outputAudioPath = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/converted_speaker_2.wav"; 

      // Mengirimkan informasi ke backend untuk menjalankan konversi suara
      ipcRenderer.send("voice-conversion", {
        inputAudioPath,
        targetAudioPath,
        outputAudioPath,
        speaker: "speaker_2" // Menambahkan informasi speaker (dynamic)
      });

      // Mendengarkan feedback setelah konversi selesai
      ipcRenderer.once("voice-conversion-complete", (event, data) => {
        console.log("Conversion feedback:", data);
        setConvertedFile2({ path: data.convertedAudioPaths.speaker2 }); // Menyimpan path hasil konversi
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Menggunakan useEffect untuk memperbarui final audio setelah konversi selesai
  useEffect(() => {
    // Panggil setFinalAudio hanya jika ada perubahan yang relevan pada konversi atau file audio
    setFinalAudio();
  }, [isConvertVoice1, isConvertVoice2, convertedFile1, convertedFile2, separatedAudioFiles]);  

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 3, // Increased gap between left and right section
        flexWrap: "wrap", // Allow content to wrap and adjust height dynamically
      }}
    >
      {/* Left Section */}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minHeight: "50vh", // Allow height to adjust based on content
          width: "fit-content",
          minWidth: "350px"
        }}
      >
        {/* Speaker 1 */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: "50vh", // Allow height to adjust based on content
            width: "fit-content",
            minWidth: "350px"
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 1, color: "white" }}>
            Speaker 1
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <Typography sx={{ color: "white" }}>Convert voice?</Typography>
            </Grid>
            <Grid item xs={6}>
              <Switch
                checked={isConvertVoice1}
                onChange={handleSwitchChange1}
                color="primary"
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: isConvertVoice1 ? theme.palette.primary.main : theme.palette.neutral.dark, // Dark color when off
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: theme.palette.neutral.white, // White color for the thumb
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* If Speaker 1's switch is on, show CustomField for input audio */}
          {isConvertVoice1 && (
            <CustomField
              mode="audio"
              labelText="Input Reference Voice"
              file={fileAudioReference1}
              setFile={setFileAudioReference1}
              onOpenFileDialog={handleOpenFileDialog1} // Handle file dialog
              isPreview={false} // Since this is an input file, not a preview
            />
          )}

          {/* Apply Button for Speaker 1 */}
          {isConvertVoice1 && (
            <Button
              variant={fileAudioReference1 ? "contained" : "outlined"} // Change the variant based on file state
              color="primary"
              sx={{
                marginBottom: 2,
                fontWeight: 600,
                textTransform: "none",
                maxWidth: 100,
                alignSelf: "flex-end",
                "&.Mui-disabled": {
                  backgroundColor: theme.palette.background.form, // Ganti dengan warna latar belakang saat disabled
                  color: theme.palette.neutral.dark, // Ganti dengan warna teks saat disabled
                  borderColor: theme.palette.neutral.dark, // Ganti warna border saat disabled
                  opacity: 0.5
                },
              }}
              disabled={!fileAudioReference1} // Disable button if no file is uploaded
              onClick={handleApplyClick1}
            >
              Apply
            </Button>
          )}

          {/* CustomField to show the converted audio after Apply */}
          {isConvertVoice1 && (
            <CustomField
              mode="audio"
              labelText="Converted Speaker 1 Voice"
              file={convertedFile1} // Show the converted file
              setFile={setConvertedFile1}
              isPreview={true} // Set to true for preview
            />
          )}
        </Grid>
      </Grid>

      {/* Divider with white color */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: "100",
          border: "0.5px solid",
          borderColor: theme.palette.neutral.dark, // Set the divider color
        }}
      />

      {/* Right Section */}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2, // Increased gap to avoid overlap
          minHeight: "50vh", // Allow height to adjust based on content
          minWidth: "350px"
        }}
      >
        {/* Speaker 2 */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: "50vh", // Allow height to adjust based on content
            width: "fit-content",
            minWidth: "350px"
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 1, color: "white" }}>
            Speaker 2
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <Typography sx={{ color: "white" }}>Convert voice?</Typography>
            </Grid>
            <Grid item xs={6}>
              <Switch
                checked={isConvertVoice2}
                onChange={handleSwitchChange2}
                color="primary"
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: isConvertVoice2 ? theme.palette.primary.main : theme.palette.neutral.dark, // Dark color when off
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: theme.palette.neutral.white, // White color for the thumb
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* If Speaker 2's switch is on, show CustomField for input audio */}
          {isConvertVoice2 && (
            <CustomField
              mode="audio"
              labelText="Input Reference Voice"
              file={fileAudioReference2}
              setFile={setFileAudioReference2}
              onOpenFileDialog={handleOpenFileDialog2} // Handle file dialog
              isPreview={false} // Since this is an input file, not a preview
            />
          )}

          {/* Apply Button for Speaker 2 */}
          {isConvertVoice2 && (
            <Button
              variant={fileAudioReference2 ? "contained" : "outlined"} // Change the variant based on file state
              color="primary"
              sx={{
                marginBottom: 2,
                fontWeight: 600,
                textTransform: "none",
                maxWidth: 100,
                alignSelf: "flex-end",
                "&.Mui-disabled": {
                  backgroundColor: theme.palette.background.form, // Ganti dengan warna latar belakang saat disabled
                  color: theme.palette.neutral.dark, // Ganti dengan warna teks saat disabled
                  borderColor: theme.palette.neutral.dark, // Ganti warna border saat disabled
                  opacity: 0.5
                },
              }}
              disabled={!fileAudioReference2} // Disable button if no file is uploaded
              onClick={handleApplyClick2}
            >
              Apply
            </Button>
          )}

          {/* CustomField to show the converted audio after Apply */}
          {isConvertVoice2 && (
            <CustomField
              mode="audio"
              labelText="Converted Speaker 2 Voice"
              file={convertedFile2} // Show the converted file
              setFile={setConvertedFile2}
              isPreview={true} // Set to true for preview
            />
          )}
        </Grid>
      </Grid>
      {/* Snackbar for invalid file format */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ModifyVoiceScreen;
