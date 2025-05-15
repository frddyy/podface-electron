import React from "react";
import ReactPlayer from "react-player/lazy"; // Import ReactPlayer
import { Box, CircularProgress } from "@mui/material"; // Use MUI Box and Typography for styling
import { VideoLibrary } from "@mui/icons-material"; // Corrected import for video
import { useTheme } from "@mui/material/styles";

const VideoPreviewField = ({ file, isLoading }) => {
  const theme = useTheme();
  
  // Check if the file is a valid video object
  const fileUrl = file && file.path ? `file://${file.path}` : null;

  // Ensure the file is valid and is of the right type
  const isValidFile = file && typeof file.path === "string";

  console.log("File URL Video: ", fileUrl)
  console.log("is valid Video: ", isValidFile)

  return (
    <div style={{ width: "100%", height: "50px" }}>
      {isLoading ? (
        // Show CircularProgress spinner when loading is true
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
          <CircularProgress />
        </Box>
      ) : isValidFile ? (
        // Display the video player if the file is available and valid
        <ReactPlayer
          url={fileUrl}
          playing={false} // Don't autoplay the video
          controls={true} // Show controls for the video
          width="50"
          style={{ marginBottom: "15px" }}
        />
      ) : (
        // Display an alternative box when no valid file is provided
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
          <VideoLibrary />
        </Box>
      )}
    </div>
  );
};

export default VideoPreviewField;
