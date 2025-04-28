import React, { useState } from "react";
import { Box, Grid, Button, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomField from "../components/CustomField"; // Import CustomField

const ProcessAudioScreen = () => {
  const [file, setFile] = useState(null);  // Store file path
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState(""); // To store feedback message
  const [separatedAudioFiles, setSeparatedAudioFiles] = useState({}); // Store paths for separated audio files
  const theme = useTheme();

  // Handle file remove
  const handleFileRemove = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // Open file dialog using ipcRenderer
  const handleOpenFileDialog = () => {
    const { ipcRenderer } = window.require("electron");

    ipcRenderer.send("open-file-dialog");

    ipcRenderer.once("file-selected", (event, data) => {
      const audioURL = data.filePath; // Object URL received from main process
      console.log("Received audio URL: ", audioURL);
      setFile({ path: audioURL });
    });
  };

  // Handle Apply button click
  const handleApplyClick = () => {
    if (file) {
      const audioPath = file.path;
      console.log("audioPath: ", audioPath);

      const { ipcRenderer } = window.require("electron");

      ipcRenderer.send("separate-audio", { audioPath });

      ipcRenderer.once("feedback", (event, data) => {
        setFeedback(data.message);
        console.log("Feedback from Python:", data.message);
      });

      ipcRenderer.once("audio-separation-complete", (event, data) => {
        // Set the paths of the separated audio files
        setSeparatedAudioFiles({
          speaker1: data.speaker1,
          speaker2: data.speaker2,
        });
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
        }}
      >
        {/* CustomField for file selection */}
        <CustomField
          mode="audio"
          labelText="Input Podcast Audio"
          file={file}
          setFile={setFile}
          setUploadProgress={setUploadProgress}
          setIsUploading={setIsUploading}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          onFileRemove={handleFileRemove}  // Optional: Pass the remove handler to CustomField
          isPreview={false} // Hide preview before file upload
          onOpenFileDialog={handleOpenFileDialog} // Pass the handler for opening file dialog
        />
        
        <Button
          variant={file ? "contained" : "outlined"} // Change the variant based on file state
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
          disabled={!file} // Disable button if no file is uploaded
          onClick={handleApplyClick}
        >
          Apply
        </Button>
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
        }}
      >
        <Box sx={{ width: "100%", height: "auto" }}>
          {/* Speaker 1 */}          
            <CustomField
              mode="audio"
              labelText="Speaker 1"
              file={{ path: separatedAudioFiles.speaker1 }}
              setFile={setFile}
              setUploadProgress={setUploadProgress}
              setIsUploading={setIsUploading}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              isPreview={true} // Show preview section after file is uploaded
              sx={{ marginBottom: 2 }} // Add space between speakers
            />
        </Box>
        {/* Speaker 2 */}
        <Box sx={{ width: "100%", height: "auto" }}>
            <CustomField
              mode="audio"
              labelText="Speaker 2"
              file={{ path: separatedAudioFiles.speaker2 }}
              setFile={setFile}
              setUploadProgress={setUploadProgress}
              setIsUploading={setIsUploading}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              isPreview={true} // Show preview section after file is uploaded
            />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProcessAudioScreen;
