import React, { useState } from "react";
import { Grid, Typography, IconButton } from "@mui/material";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { useTheme } from "@mui/material/styles";
import UploadField from "./UploadField"; // Import the UploadField component
import AudioPreviewField from "./AudioPreviewField"; // Import the preview component for audio
import ImagePreviewField from "./ImagePreviewField"; // Import the preview component for image
import VideoPreviewField from "./VideoPreviewField"; // Import the preview component for video
import { MusicNote, Image, VideoLibrary } from "@mui/icons-material"; // Corrected import

const CustomField = ({
  mode = "audio",
  labelText,
  onFileRemove,
  isPreview = false,
  file,
  setFile,
  setUploadProgress,
  setIsUploading,
  uploadProgress,
  isUploading,
}) => {
  const theme = useTheme();

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (onFileRemove) onFileRemove();
  };

  return (
    <Grid
      sx={{
        textAlign: "center",
        position: "relative",
        width: "100",
        height: "100",
        gap: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title and remove button */}
      <Grid
        sx={{
          display: "flex",
          padding: "4px",
          color: theme.palette.neutral.dark,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          {mode === "audio" ? (
            <MusicNote />
          ) : mode === "image" ? (
            <Image />
          ) : mode === "video" ? (
            <VideoLibrary />
          ) : null}
          <Typography variant="body1">{labelText}</Typography>
        </Grid>

        {/* Remove button (only visible if a file is uploaded) */}
        {file && (
          <IconButton onClick={handleRemoveFile}>
            <DisabledByDefaultOutlinedIcon
              sx={{ color: theme.palette.neutral.dark }}
            />
          </IconButton>
        )}
      </Grid>

      {/* Upload or Preview Section */}
      {isPreview ? (
        // Check for the mode and show the correct preview field
        mode === "audio" ? (
          <AudioPreviewField file={file} />
        ) : mode === "image" ? (
          <ImagePreviewField file={file} />
        ) : mode === "video" ? (
          <VideoPreviewField file={file} />
        ) : null
      ) : (
        // Show upload field if file isn't uploaded yet
        <UploadField
          mode={mode}
          file={file}
          setFile={setFile}
          setUploadProgress={setUploadProgress}
          setIsUploading={setIsUploading}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
        />
      )}
    </Grid>
  );
};

export default CustomField;
