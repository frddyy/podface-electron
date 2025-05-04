import React from "react";
import { Img } from "react-image"; // Importing Img component from react-image
import { Box } from "@mui/material";
import { Image } from "@mui/icons-material"; // Image icon for the preview fallback

const ImagePreviewField = ({ file }) => {
  // Ensure the file is valid and has a path
  const fileUrl = file && file.path ? `file://${file.path}` : null;
  const isValidFile = file && typeof file.path === "string";

  return (
    <div style={{ width: "100%", height: "auto", textAlign: "center" }}>
      {/* Check if file is available and valid */}
      {isValidFile ? (
        <Img
          src={fileUrl} // Pass the correctly formatted file URL
          alt="Preview"
          loader={<div>Loading...</div>} // Fallback loader
          unloader={<div>Failed to load image</div>} // Fallback for failed load
          style={{
            maxWidth: "100%", // Prevent the image from exceeding container width
            maxHeight: "100%", // Maintain aspect ratio
            objectFit: "contain", // Make sure the image scales without distortion
          }}
        />
      ) : (
        // Fallback UI like AudioPreviewField when the file is invalid
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid",
            padding: "70px 120px",
            borderRadius: 1,
            borderColor: "#ccc",
            color: "#ccc",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Image />
        </Box>
      )}
    </div>
  );
};

export default ImagePreviewField;
