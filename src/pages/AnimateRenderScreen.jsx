import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Divider, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAudioContext } from "../context/AudioContext";
import { useFaceModelContext } from "../context/FaceModelContext";
import CustomField from "../components/CustomField";

const AnimateRenderScreen = () => {
  const theme = useTheme();
  const [isSpeaker1Rendered, setIsSpeaker1Rendered] = useState(false); // State untuk mengecek apakah animasi speaker 1 sudah dirender
  const [isSpeaker2Rendered, setIsSpeaker2Rendered] = useState(false); // State untuk mengecek apakah animasi speaker 2 sudah dirender

  const [videoFile1, setVideoFile1] = useState(null);
  const [videoFile2, setVideoFile2] = useState(null);

  const { finalAudio1, finalAudio2, setFinalAudio1, setFinalAudio2 } = useAudioContext(); // Ambil final audio dari context
  const { finalFace1, finalFace2, setFinalFace1, setFinalFace2 } = useFaceModelContext(); // Ambil final face dari context

  const handleApplyClick1 = () => {
    console.log("Running VOCA for Speaker 1...");
  
    const { ipcRenderer } = window.require("electron");
  
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
      setIsSpeaker1Rendered(true); // Optionally, set the message to display in the UI
    });
  };

  const handleApplyClick2 = () => {
    console.log("Running VOCA for Speaker 2...");
  
    const { ipcRenderer } = window.require("electron");
  
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
      setIsSpeaker2Rendered(true); // Optionally, set the message to display in the UI
    });
  };

  // useEffect untuk memantau perubahan final audio
  useEffect(() => {
    console.log("Final Audio Speaker 1:", finalAudio1);
    console.log("Final Audio Speaker 2:", finalAudio2);
    console.log("Final Face Speaker 1:", finalFace1);
    console.log("Final Face Speaker 2:", finalFace2);
  }, [finalAudio1, finalAudio2, finalFace1, finalFace2]); 

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
        {!isSpeaker1Rendered ? (
          <>
            <Box sx={{ marginBottom: 2 }}>
              <CustomField
                mode="3d"
                labelText="3D Face Model"
                file={finalFace1}
                setFile={setFinalFace1}
                isPreview={true} // Show preview
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <CustomField
                mode="audio"
                labelText="Final Audio"
                file={finalAudio1}
                setFile={setFinalAudio1}
                isPreview={true} // Show Preview
              />
            </Box>

            <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
              {(finalAudio1 && finalFace1) && (
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
        ) : (
          // Tampilkan video atau konten lain jika animasi belum dirender
          <Box sx={{ marginBottom: 2 }}>
            <CustomField
              mode="video"
              labelText="Render Animation"
              file={videoFile1} // Placeholder for video input
              setFile={setVideoFile1} // Set function can be empty as this is for video render placeholder
              isPreview={true} // Show video for preview before rendering
            />
          </Box>
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

        {!isSpeaker2Rendered ? (
          <>
            <Box sx={{ marginBottom: 2 }}>
              <CustomField
                mode="3d"
                labelText="3D Face Model"
                file={finalFace2}
                setFile={setFinalFace2}
                isPreview={true} // Show preview
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <CustomField
                mode="audio"
                labelText="Final Audio"
                file={finalAudio2}
                setFile={setFinalAudio2}
                isPreview={true} // Show Preview
              />
            </Box>

            <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
              {(finalAudio2 && finalFace2) && (
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
        ) : (
          // Tampilkan video atau konten lain jika animasi belum dirender
          <Box sx={{ marginBottom: 2 }}>
            <CustomField
              mode="video"
              labelText="Render Animation"
              file={videoFile2} // Placeholder for video input
              setFile={setVideoFile2} // Set function can be empty as this is for video render placeholder
              isPreview={true} // Show video for preview before rendering
            />
          </Box>
        )}  
      </Grid>
    </Grid>
  );
}

export default AnimateRenderScreen