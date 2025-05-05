import React, { useEffect } from "react";
import { Box, Grid, Typography, Divider, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAudioContext } from "../context/AudioContext";
import { useFaceModelContext } from "../context/FaceModelContext";
import CustomField from "../components/CustomField";

const AnimateRenderScreen = () => {
  const theme = useTheme();

  const { finalAudio1, finalAudio2, setFinalAudio1, setFinalAudio2 } = useAudioContext(); // Ambil final audio dari context
  const { finalFace1, finalFace2, setFinalFace1, setFinalFace2 } = useFaceModelContext(); // Ambil final face dari context

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
              disabled={!(finalAudio1 && finalFace1)}
              // onClick={handleApplyClick1}
            >
              Apply
            </Button>
          )}
        </Box>
    
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
              // onClick={handleApplyClick2}
            >
              Apply
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default AnimateRenderScreen