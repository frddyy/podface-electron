import React, { useState } from "react";
import CustomField from "../components/CustomField";
import { Box, Grid, Button, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ProcessAudioScreen = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const theme = useTheme();

  const handleFileRemove = () => {
    console.log("File removed");
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

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
      {/* Left Section */}
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
        }}
      >
        <CustomField
          mode="audio"
          labelText="Input Podcast Audio"
          file={file}
          setFile={setFile}
          setUploadProgress={setUploadProgress}
          setIsUploading={setIsUploading}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          isPreview={false} // Show upload section
        />
        <Button
          variant={file ? "contained" : "outlined"} // Change the variant based on file state
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
          disabled={!file} // Disable button if no file is uploaded
        >
          Apply
        </Button>
      </Grid>

      {/* Divider with white color */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: "100",
          border: "0.5px solid",
          borderColor: theme.palette.neutral.dark, // Set the divider color to white
        }}
      />

      {/* Right Section */}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 20, // Increased gap to avoid overlap
          minHeight: 0, // Allow height to adjust based on content
        }}
      >
        <Box sx={{ width: "100%", height: "auto" }}>
          {/* Speaker 1 */}
          <CustomField
            mode="audio"
            labelText="Speaker 1"
            file={file}
            setFile={setFile}
            setUploadProgress={setUploadProgress}
            setIsUploading={setIsUploading}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            isPreview={true} // Show preview section after file is uploaded
            sx={{ marginBottom: 2 }} // Add space between speakers
          />
        </Box>
        {/* Speaker 2 */}
        <Box sx={{ width: "100%", height: "auto" }}>
          <CustomField
            mode="audio"
            labelText="Speaker 2"
            file={file}
            setFile={setFile}
            setUploadProgress={setUploadProgress}
            setIsUploading={setIsUploading}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            isPreview={true} // Show preview section after file is uploaded
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProcessAudioScreen;
