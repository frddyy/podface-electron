import React from "react";
import ReactPlayer from "react-player/lazy"; // Import ReactPlayer
import { Box, Typography } from "@mui/material"; // Use MUI Box and Typography for styling
import { MusicNote } from "@mui/icons-material"; // Corrected import
import { useTheme } from "@mui/material/styles";

const AudioPreviewField = ({ file }) => {
  const theme = useTheme();

  return (
    <div style={{ width: "100%", height: "50px" }}>
      {/* Check if file is available */}
      {file ? (
        // Display the audio player if the file is available
        <ReactPlayer
          url={URL.createObjectURL(file)} // Audio file URL
          playing={true} // Start playing automatically
          controls={true} // Show controls
          width="100%" // Take full width of container
          height="50px" // Set fixed height for the player
          style={{ marginBottom: "15px" }}
        />
      ) : (
        // Display an alternative box when no file is provided
        <Box
          sx={{
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
          }}
        >
          <MusicNote />
        </Box>
      )}
    </div>
  );
};

export default AudioPreviewField;
