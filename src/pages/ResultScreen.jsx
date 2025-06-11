import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomField from "../components/CustomField"; // Pastikan CustomField disesuaikan untuk video
import { usePodcastContext } from '../context/PodcastContext';
import { useAudioContext } from '../context/AudioContext';
import { useRenderContext } from '../context/RenderContext';
const ResultScreen = () => {
  const { videoPodcastFile, setVideoPodcastFile, isPodcastMerged, isGeneratePodcastLoading, setIsGeneratePodcastLoading } = usePodcastContext();
  const { finalAudio1, finalAudio2 } = useAudioContext();
  const { videoFile1, videoFile2 } = useRenderContext();

  const [snackbarOpen, setSnackbarOpen] = useState(false);  
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [progress, setProgress] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    const { ipcRenderer } = window.require("electron");
    const handleProgressUpdate = (event, { percentage }) => {
      setProgress(percentage);
    };
    ipcRenderer.on('processing-progress', handleProgressUpdate);
    return () => {
      ipcRenderer.removeListener('processing-progress', handleProgressUpdate);
    };
  }, []);

  const handleGenerate = () => {
    console.log("Starting to generate podcast...");

    const { ipcRenderer } = window.require("electron");

    // Path for the combined audio file
    const combinedAudioPath = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/combined_audio.wav";
    const outputPath = "/home/daffaraihandika/TA/podface-electron/src/assets/video/final_podcast.mp4";

    setIsGeneratePodcastLoading(true);
    setProgress(0);

    // Menggabungkan audio
    ipcRenderer.send("combine-audio", {
      audioPath1: finalAudio1.path,
      audioPath2: finalAudio2.path,
      outputPath: combinedAudioPath,
    });

    ipcRenderer.once("audio-combined", (event, data) => {
      console.log("Audio combined:", data);

      // Setelah penggabungan audio selesai, lanjutkan dengan menggabungkan video
      ipcRenderer.send("merge-podcasts", {
        video1Path: videoFile1.path,
        video2Path: videoFile2.path,
        audioPath: combinedAudioPath, // Path audio gabungan
        outputPath: outputPath,
      });

      ipcRenderer.once("podcast-merged", (event, data) => {
        console.log("Podcast merged successfully!", data);

        // Set video file for podcast and trigger necessary updates
        setVideoPodcastFile({ path: data.output });
        setSnackbarMessage("Generate podcast video completed successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsGeneratePodcastLoading(false);
      });
    });
  };

  useEffect(() => {
    console.log("Current videoPodcastFile: ", videoPodcastFile);
  }, [videoPodcastFile]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="start"
      alignItems="center"
      sx={{
        minWidth: "100%"
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2, color: "white" }}>
        Podcast Video
      </Typography>

      {/* Display the video inside CustomField */}
      <Box sx={{ maxWidth: "800px", width: "100%", mb: 10 }}>
        <CustomField
          mode="video"
          labelText="Podcast Video"
          isPreview={true}
          file={videoPodcastFile}
          setFile={setVideoPodcastFile}
          isLoading={isGeneratePodcastLoading}
          progress={progress}
        />
      </Box>

      {/* Additional styling or content can be added here */}
      {!isPodcastMerged && !isGeneratePodcastLoading && (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 7 }}>
          <Button
            variant="contained"
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
            disabled={!(videoFile1 && videoFile2) || isGeneratePodcastLoading}
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </Box>
      )}
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

export default ResultScreen;
