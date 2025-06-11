import React from "react";
import ReactPlayer from "react-player/lazy";
import { Box, CircularProgress, Typography } from "@mui/material";
import { MusicNote } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const AudioPreviewField = ({ file, isLoading, progress }) => {
  const theme = useTheme();
  // Tambahkan "file://" jika belum ada pada path file
  const fileUrl = file && file.path ? `file://${file.path}` : null;

  // Pastikan file adalah objek yang valid
  const isValidFile = file && typeof file.path === "string";

  const boxStyles = {
    width: "100",
    height: "100",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid",
    padding: "70px 120px",
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.neutral.dark,
    color: theme.palette.neutral.dark,
    backgroundColor: theme.palette.background.form,
  }

  return (
    <div style={{ width: "100%", height: "50px" }}>
      {isLoading ? (
        <Box sx={boxStyles}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={progress} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" color="white">
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : isValidFile ? (
        // Display the audio player if the file is available and valid
        <ReactPlayer
          url={fileUrl}
          playing={false} // Start playing automatically
          controls={true} // Show controls
          width="100%" // Take full width of container
          height="100%" // Set fixed height for the player
          style={{ marginBottom: "15px" }}
        />
      ) : (
        // Display an alternative box when no valid file is provided
        <Box sx={boxStyles}>
          <MusicNote />
        </Box>
      )}
    </div>
  );
};

export default AudioPreviewField;
