import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Divider, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomField from "../components/CustomField";
import { useAudioContext } from "../context/AudioContext";

const ProcessAudioScreen = () => {
  const { fileAudioPodcast, setFileAudioPodcast, separatedAudioFiles, setSeparatedAudioFiles, isSeparationLoading, setIsSeparationLoading } = useAudioContext(); // Ambil context dari AudioContext
  const [snackbarOpen, setSnackbarOpen] = useState(false);  
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const theme = useTheme();

  useEffect(() => {
      console.log("Separated Audio Files:", separatedAudioFiles);
    }, [separatedAudioFiles]); 

  // Open file dialog using ipcRenderer
  const handleOpenFileDialog = () => {
    const { ipcRenderer } = window.require("electron");

    ipcRenderer.send("open-audio-file-dialog");

    ipcRenderer.once("audio-file-selected", (event, data) => {
      const audioURL = data.audioFilePath; // Object URL received from main process
      console.log("Received audio URL: ", audioURL);

      setFileAudioPodcast({ path: audioURL });
    });

    ipcRenderer.once("invalid-audio-file", (event, data) => {
      // If the file is invalid, show an error message in Snackbar
      setSnackbarMessage(data.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    });
  };

  // Handle Apply button click
  const handleApplyClick = () => {
    if (fileAudioPodcast) {
      const audioPath = fileAudioPodcast.path;
      console.log("audioPath: ", audioPath);

      setIsSeparationLoading(true);

      const { ipcRenderer } = window.require("electron");

      ipcRenderer.send("separate-audio", { audioPath });

      ipcRenderer.once("feedback", (event, data) => {
        console.log("Feedback from Python:", data.message);
      });

      ipcRenderer.once("audio-enhancement-complete", (event, data) => {
        // Set the paths of the separated audio files
        setSeparatedAudioFiles({
          speaker1: data.enhancedSpeaker1,
          speaker2: data.enhancedSpeaker2,
        });
        setSnackbarMessage("Audio separation & enhancement completed successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsSeparationLoading(false);
      });

      // Feedback ketika terjadi error
      ipcRenderer.once("Error executing audio separation", (event, data) => {
        console.error("Speech separation error:", data.error);
        setSnackbarMessage(`Error during speech separation: ${data.error}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setIsSeparationLoading(false);
      });

      ipcRenderer.once("Error executing audio enhancement", (event, data) => {
        console.error("Speech enhancement error:", data.error);
        setSnackbarMessage(`Error during speech enhancement: ${data.error}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setIsSeparationLoading(false);
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
        {/* CustomField for file selection */}
        <CustomField
          mode="audio"
          labelText="Input Podcast Audio"
          file={fileAudioPodcast}
          setFile={setFileAudioPodcast}
          isPreview={false} // Hide preview before file upload
          onOpenFileDialog={handleOpenFileDialog} // Pass the handler for opening file dialog
        />
        
        {!isSeparationLoading && (
          <Button
            variant={fileAudioPodcast ? "contained" : "outlined"} // Change the variant based on file state
            color="primary"
            sx={{
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
            disabled={!fileAudioPodcast} // Disable button if no file is uploaded
            onClick={handleApplyClick}
          >
            Apply
          </Button>
        )}
      </Grid>

      {/* Divider with white color */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: "100",
          border: "0.5px solid",
          borderColor: theme.palette.neutral.dark, // Set the divider color to white
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
          gap: 20, // Increased gap to avoid overlap
          minHeight: 0, // Allow height to adjust based on content
          minWidth: "350px"
        }}
      >
        <Box sx={{ width: "100%", height: "auto" }}>
          {/* Speaker 1 */}          
            <CustomField
              mode="audio"
              labelText="Speaker 1"
              file={{ path: separatedAudioFiles.speaker1 }}
              setFile={setSeparatedAudioFiles}
              isPreview={true} // Show preview section after file is uploaded
              isLoading={isSeparationLoading}
              sx={{ marginBottom: 2 }} // Add space between speakers
            />
        </Box>
        {/* Speaker 2 */}
        <Box sx={{ width: "100%", height: "auto" }}>
            <CustomField
              mode="audio"
              labelText="Speaker 2"
              file={{ path: separatedAudioFiles.speaker2 }}
              setFile={setSeparatedAudioFiles}
              isPreview={true} // Show preview section after file is uploaded
              isLoading={isSeparationLoading}
            />
        </Box>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} 
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProcessAudioScreen;
