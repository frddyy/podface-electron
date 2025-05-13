import React, { useEffect } from 'react';
import { Grid, Typography, Box, Button } from "@mui/material";
import CustomField from "../components/CustomField"; // Pastikan CustomField disesuaikan untuk video
import { usePodcastContext } from '../context/PodcastContext';

const ResultScreen = () => {
  const { videoPodcastFile, setVideoPodcastFile } = usePodcastContext();

  useEffect(() => {
    console.log("Current videoPodcastFile: ", videoPodcastFile);
  }, [videoPodcastFile]);

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
      <Box sx={{ maxWidth: "800px", width: "100%", mb: 2 }}>
        <CustomField
          mode="video"
          labelText="Podcast Video"
          isPreview={true}
          file={videoPodcastFile}
          setFile={setVideoPodcastFile}
        />
      </Box>

      {/* Additional styling or content can be added here */}
    </Grid>
  );
};

export default ResultScreen;
