import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Divider, Button, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAudioContext } from "../context/AudioContext";
import { useFaceModelContext } from "../context/FaceModelContext";
import { useRenderContext } from "../context/RenderContext";
import CustomField from "../components/CustomField";

const AnimateRenderScreen = () => {
  const theme = useTheme();

  const { setIsSpeaker1Rendered, setIsSpeaker2Rendered, isSpeaker1Rendered, isSpeaker2Rendered, videoFile1, setVideoFile1, videoFile2, setVideoFile2, isRendering1Loading, setIsRendering1Loading, isRendering2Loading, setIsRendering2Loading } = useRenderContext();
  const { finalAudio1, finalAudio2, setFinalAudio1, setFinalAudio2 } = useAudioContext(); // Ambil final audio dari context
  const { finalFace1, finalFace2, setFinalFace1, setFinalFace2 } = useFaceModelContext(); // Ambil final face dari context

  const [snackbarOpen, setSnackbarOpen] = useState(false);  
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleApplyClick1 = () => {
    console.log("Running VOCA for Speaker 1...");
  
    const { ipcRenderer } = window.require("electron");

    setIsRendering1Loading(true);
    setIsSpeaker1Rendered(true);
  
    // Define the paths for VOCA arguments
    const audioPath = finalAudio1.path;
    const templatePath = finalFace1.path;
    const outputPath = "/home/daffaraihandika/TA/podface-electron/src/assets/animation/animation_speaker1";
  
    // Send IPC request to run the VOCA process
    ipcRenderer.send("run-voca", {
      audioPath: audioPath,
      templatePath: templatePath,
      outputPath: outputPath
    });
  
    // Listen for feedback from the VOCA process
    ipcRenderer.once("voca-processing-complete", (event, data) => {
      console.log(data.message); // Handle the success message
      setVideoFile1({
        path: `${outputPath}/video.mp4`  // Assuming `data.outputPath` contains the correct output path
      });
      setSnackbarMessage("Facial animation for speaker 1 completed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setIsRendering1Loading(false);
    });
  };

  const handleApplyClick2 = () => {
    console.log("Running VOCA for Speaker 2...");
  
    const { ipcRenderer } = window.require("electron");

    setIsRendering2Loading(true);
    setIsSpeaker2Rendered(true);
  
    // Define the paths for VOCA arguments
    const audioPath = finalAudio2.path;
    const templatePath = finalFace2.path;
    const outputPath = "/home/daffaraihandika/TA/podface-electron/src/assets/animation/animation_speaker2";
  
    // Send IPC request to run the VOCA process
    ipcRenderer.send("run-voca", {
      audioPath: audioPath,
      templatePath: templatePath,
      outputPath: outputPath
    });
  
    // Listen for feedback from the VOCA process
    ipcRenderer.once("voca-processing-complete", (event, data) => {
      console.log(data.message); // Handle the success message
      setVideoFile2({
        path: `${outputPath}/video.mp4`  // Assuming `data.outputPath` contains the correct output path
      });
      setSnackbarMessage("Facial animation for speaker 2 completed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setIsRendering2Loading(false);
    });
  };

  // useEffect untuk memantau perubahan final audio
  useEffect(() => {
    console.log("Final Audio Speaker 1:", finalAudio1);
    console.log("Final Audio Speaker 2:", finalAudio2);
    console.log("Final Face Speaker 1:", finalFace1);
    console.log("Final Face Speaker 2:", finalFace2);
  }, [finalAudio1, finalAudio2, finalFace1, finalFace2]); 

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
      {/* Left Section for Speaker 1 */}
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
        <Typography variant="h4" sx={{ marginBottom: 1, color: "white" }}>
          Speaker 1
        </Typography>

        {/* Show CustomField for Face and Audio if rendered, else show video */}
        {!isSpeaker1Rendered && (
          <>
            <Box sx={{ marginBottom: 2 }}>
              <CustomField
                mode="3d"
                labelText="3D Face Model"
                file={finalFace1}
                setFile={setFinalFace1}
                isPreview={true} // Show preview
                hideRemoveButton={true}
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <CustomField
                mode="audio"
                labelText="Final Audio"
                file={finalAudio1}
                setFile={setFinalAudio1}
                isPreview={true} // Show Preview
                hideRemoveButton={true}
              />
            </Box>

            <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
              {(finalAudio1?.path && finalFace1) && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    marginBottom: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    maxWidth: 100,
                  }}
                  disabled={!(finalAudio1 && finalFace1)} // Disable button if no file is uploaded
                  onClick={handleApplyClick1}
                >
                  Apply
                </Button>
              )}
            </Box>
          </>
        )} 

        {(isRendering1Loading || isSpeaker1Rendered) && (
          <CustomField
            mode="video"
            labelText="Render Animation"
            file={videoFile1} // Placeholder for video input
            setFile={setVideoFile1} // Set function can be empty as this is for video render placeholder
            isPreview={true} // Show video for preview before rendering
            isLoading={isRendering1Loading} // Show loading spinner when rendering
          />
        )}
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

      {/* Right Section for Speaker 2 */}
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
        <Typography variant="h4" sx={{ marginBottom: 1, color: "white" }}>
          Speaker 2
        </Typography>

        {!isSpeaker2Rendered && (
          <>
            <Box sx={{ marginBottom: 2 }}>
              <CustomField
                mode="3d"
                labelText="3D Face Model"
                file={finalFace2}
                setFile={setFinalFace2}
                isPreview={true} // Show preview
                hideRemoveButton={true}
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <CustomField
                mode="audio"
                labelText="Final Audio"
                file={finalAudio2}
                setFile={setFinalAudio2}
                isPreview={true} // Show Preview
                hideRemoveButton={true}
              />
            </Box>

            <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
              {(finalAudio2?.path && finalFace2) && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    marginBottom: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    maxWidth: 100,
                  }}
                  disabled={!(finalAudio2 && finalFace2)}
                  onClick={handleApplyClick2}
                >
                  Apply
                </Button>
              )}
            </Box>
          </>
        )} 
        
        {(isRendering2Loading || isSpeaker2Rendered) && (
          <Box sx={{ marginBottom: 2 }}>
            <CustomField
              mode="video"
              labelText="Render Animation"
              file={videoFile2} // Placeholder for video input
              setFile={setVideoFile2} // Set function can be empty as this is for video render placeholder
              isPreview={true} // Show video for preview before rendering
              isLoading={isRendering2Loading}
            />
          </Box>
        )}  
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
}

export default AnimateRenderScreen