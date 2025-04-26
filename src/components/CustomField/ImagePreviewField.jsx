// ImagePreviewField.jsx
import React from "react";

const ImagePreviewField = ({ file }) => {
  return (
    <img
      src={URL.createObjectURL(file)} // Display the image preview
      alt="Preview"
      style={{
        maxWidth: "100%", // Prevent the image from exceeding the container width
        maxHeight: "100%", // Maintain aspect ratio
        objectFit: "contain", // Make sure the image scales without distorting
      }}
    />
  );
};

export default ImagePreviewField;
