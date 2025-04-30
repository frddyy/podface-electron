import React, { useState } from "react";
import { Box, Grid, Typography, Divider, Switch, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomField from "../components/CustomField";

const ModifyVoiceScreen = () => {
  const theme = useTheme();

  // State untuk kontrol Convert Voice untuk Speaker 1 dan Speaker 2
  const [convertVoice1, setConvertVoice1] = useState(false);
  const [convertVoice2, setConvertVoice2] = useState(false);
  const [file1, setFile1] = useState(null); // Store file untuk Speaker 1
  const [file2, setFile2] = useState(null); // Store file untuk Speaker 2
  const [convertedFile, setConvertedFile] = useState(null); // Store file hasil konversi

  // Fungsi untuk menangani perubahan pada switch
  const handleSwitchChange1 = (event) => {
    setConvertVoice1(event.target.checked);
  };

  const handleSwitchChange2 = (event) => {
    setConvertVoice2(event.target.checked);
  };

  // Fungsi untuk membuka file dialog dan memilih file audio
  const handleOpenFileDialog1 = () => {
    const { ipcRenderer } = window.require("electron");

    ipcRenderer.send("open-file-dialog");

    ipcRenderer.once("file-selected", (event, data) => {
      const audioURL = data.filePath; // Object URL received from main process
      console.log("Received audio URL: ", audioURL);
      setFile1({ path: audioURL });
    });
  };

  // Fungsi yang dipanggil saat tombol Apply diklik untuk Speaker 1
  const handleApplyClick1 = () => {
    console.log("Applying voice conversion for Speaker 1...");

    if (file1) {
      const { ipcRenderer } = window.require("electron");

      // Path input (enhanced speaker audio) and target audio (from file dialog)
      const inputAudioPath = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/enhanced_speaker_1.wav"; 
      const targetAudioPath = file1.path;
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
        setConvertedFile({ path: data.convertedAudioPath }); // Menyimpan path hasil konversi
      });
    }
  };

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
                checked={convertVoice1}
                onChange={handleSwitchChange1}
                color="primary"
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: convertVoice1 ? theme.palette.primary.main : theme.palette.neutral.dark, // Dark color when off
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: theme.palette.neutral.white, // White color for the thumb
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* If Speaker 1's switch is on, show CustomField for input audio */}
          {convertVoice1 && (
            <CustomField
              mode="audio"
              labelText="Input Reference Voice"
              file={file1}
              setFile={setFile1}
              onOpenFileDialog={handleOpenFileDialog1} // Handle file dialog
              isPreview={false} // Since this is an input file, not a preview
            />
          )}

          {/* Apply Button for Speaker 1 */}
          {convertVoice1 && (
            <Button
              variant={file1 ? "contained" : "outlined"} // Change the variant based on file state
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
              disabled={!file1} // Disable button if no file is uploaded
              onClick={handleApplyClick1}
            >
              Apply
            </Button>
          )}

          {/* CustomField to show the converted audio after Apply */}
          {convertVoice1 && (
            <CustomField
              mode="audio"
              labelText="Converted Speaker 1 Voice"
              file={convertedFile} // Show the converted file
              setFile={setConvertedFile}
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
          minHeight: 0, // Allow height to adjust based on content
          minWidth: "350px"
        }}
      >
        {/* Speaker 2 */}
        <Box>
          <Typography variant="h4" sx={{ marginBottom: 1, color: "white" }}>
            Speaker 2
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <Typography sx={{ color: "white" }}>Convert voice?</Typography>
            </Grid>
            <Grid item xs={6}>
              <Switch
                checked={convertVoice2}
                onChange={handleSwitchChange2}
                color="primary"
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: convertVoice2 ? theme.palette.primary.main : theme.palette.neutral.dark, // Dark color when off
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: theme.palette.neutral.white, // White color for the thumb
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ModifyVoiceScreen;
