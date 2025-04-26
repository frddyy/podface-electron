// VideoPreviewField.jsx
import React from "react";
import ReactPlayer from "react-player/lazy"; // Import ReactPlayer

const VideoPreviewField = ({ file }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactPlayer
        url={URL.createObjectURL(file)} // Video file URL
        playing={true} // Start playing automatically
        controls={true} // Show native controls
        width="100%" // Take full width of container
        height="100%" // Set height to fill the container
        style={{ objectFit: "contain", marginBottom: "15px" }}
      />
    </div>
  );
};

export default VideoPreviewField;
