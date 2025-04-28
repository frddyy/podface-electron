import React, { useCallback } from "react";
import { Box, Grid, Typography, LinearProgress } from "@mui/material";
import { FileUpload as FileUploadIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import AudioPreviewField from "./AudioPreviewField"; // For audio preview
import ImagePreviewField from "./ImagePreviewField"; // For image preview
import VideoPreviewField from "./VideoPreviewField"; // For video preview
import MeshPreviewField from "./MeshPreviewField"; // For mesh preview

const UploadField = ({
  mode = "audio",
  file,
  setFile,
  setUploadProgress,
  setIsUploading,
  uploadProgress,
  isUploading,
  onOpenFileDialog, // Added prop to open file dialog
}) => {
  const theme = useTheme();

  // Simulate file upload progress
  const simulateFileUpload = (file) => {
    const totalFileSize = file.size;
    let uploadedSize = 0;

    const uploadInterval = setInterval(() => {
      if (uploadedSize < totalFileSize) {
        uploadedSize += totalFileSize * 0.05; // Simulate 5% progress each step
        const progress = Math.min((uploadedSize / totalFileSize) * 100, 100);
        setUploadProgress(progress);
      } else {
        clearInterval(uploadInterval);
        setIsUploading(false); // Finish the upload and stop the simulation
      }
    }, 200); // Simulate a file upload interval
  };

  const handleFileUpload = () => {
    onOpenFileDialog(); // Open file dialog using the passed handler
    
  };

  return (
    <>
      {/* Show the upload box only before file is uploaded */}
      {!file && !isUploading && (
        <Box
          sx={{
            border: "1px dashed #ccc",
            borderColor: theme.palette.neutral.dark,
            borderRadius: theme.shape.borderRadius,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            backgroundColor: isUploading
              ? theme.palette.background.form
              : theme.palette.background.light,
          }}
        >
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              padding: "70px 120px",
              color: theme.palette.neutral.dark,
            }}
          >
            <FileUploadIcon sx={{ fontSize: 40 }} />
            <Typography variant="body1">
              Drop{" "}
              {mode === "audio"
                ? "Audio"
                : mode === "image"
                ? "Image"
                : mode === "video"
                ? "Video"
                : "3D Model"}{" "}
              Here
            </Typography>
            <Typography variant="body1">- or -</Typography>
            <Typography variant="body1" onClick={handleFileUpload} style={{ cursor: 'pointer' }}>
              Click to Upload
            </Typography>
          </Grid>
        </Box>
      )}

      {/* Show upload progress with LinearProgress while uploading */}
      {file && isUploading && (
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.neutral.dark,
            maxWidth: "100%",
            maxHeight: "100%",
            gap: 2,
          }}
        >
          <Typography variant="body2">Uploading 1 file ...</Typography>
          {/* Replace CircularProgress with LinearProgress */}
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{
              width: "100%",
              height: 10,
              borderRadius: 5,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              maxWidth: "300px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {file.name}
          </Typography>
        </Grid>
      )}

      {/* Show the preview after upload */}
      {!isUploading && file && (
        <>
          {mode === "audio" ? (
            <AudioPreviewField file={file} />
          ) : mode === "image" ? (
            <ImagePreviewField file={file} />
          ) : mode === "video" ? (
            <VideoPreviewField file={file} />
          ) : mode === "mesh" ? (
            <MeshPreviewField file={file} />
          ) : null}
        </>
      )}
    </>
  );
};

export default UploadField;
