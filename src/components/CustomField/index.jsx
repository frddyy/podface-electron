import React from "react";
import { Grid, Typography, IconButton } from "@mui/material";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { useTheme } from "@mui/material/styles";
import UploadField from "./UploadField"; // Import the UploadField component
import AudioPreviewField from "./AudioPreviewField"; // Import the preview component for audio
import ImagePreviewField from "./ImagePreviewField"; // Import the preview component for image
import VideoPreviewField from "./VideoPreviewField"; // Import the preview component for video
import MeshPreviewField from "./MeshPreviewField"; // Import the MeshPreviewField for 3D meshes
import { MusicNote, Image, VideoLibrary, MoodOutlined } from "@mui/icons-material"; // Corrected import
import { useAudioContext } from "../../context/AudioContext";

const CustomField = ({
  mode = "audio",
  labelText,
  onFileRemove,
  isPreview = false,
  file,
  setFile,
  onOpenFileDialog,
  hideRemoveButton = false,
  isLoading = false,
}) => {
  const theme = useTheme();
  const { setSeparatedAudioFiles, separatedAudioFiles } = useAudioContext(); // Ambil context dari AudioContext

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    if (mode === "audio" && labelText === "Speaker 1") {
      setSeparatedAudioFiles((prevState) => ({
        ...prevState,
        speaker1: null, // Hapus entri untuk Speaker 1
      }));
    } else if (mode === "audio" && labelText === "Speaker 2") {
      setSeparatedAudioFiles((prevState) => ({
        ...prevState,
        speaker2: null, // Hapus entri untuk Speaker 2
      }));
    }
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
          ) : mode === "3d" ? (
            <MoodOutlined />
          ) : null}
          <Typography variant="body1">{labelText}</Typography>
        </Grid>

        {/* Remove button (only visible if a file is uploaded) */}
        {!hideRemoveButton && (
          (file && file.path) ||
          (mode === "audio" && labelText === "Speaker 1" && separatedAudioFiles.speaker1) ||
          (mode === "audio" && labelText === "Speaker 2" && separatedAudioFiles.speaker2)
        ) ? (
          <IconButton onClick={handleRemoveFile}>
            <DisabledByDefaultOutlinedIcon sx={{ color: theme.palette.neutral.dark }} />
          </IconButton>
        ) : null}
      </Grid>

      {/* Upload or Preview Section */}
      {isPreview ? (
        // Check for the mode and show the correct preview field
        mode === "audio" ? (
          <AudioPreviewField file={file} isLoading={isLoading} />
        ) : mode === "image" ? (
          <ImagePreviewField file={file} />
        ) : mode === "video" ? (
          <VideoPreviewField file={file} isLoading={isLoading} />
        ) : mode === "3d" ? (
          <MeshPreviewField file={file} isLoading={isLoading} />
        ) : null
      ) : (
        // Show upload field if file isn't uploaded yet
        <UploadField
          mode={mode}
          file={file}
          setFile={setFile}
          onOpenFileDialog={onOpenFileDialog} // Pass the handler for file dialog
        />
      )}
    </Grid>
  );
};

export default CustomField;
