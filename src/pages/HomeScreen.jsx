// src/pages/HomeScreen.js
import React from "react";
import { Typography, Box, Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Access the theme
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo"; // Assuming Logo component exists

const HomeScreen = () => {
  const theme = useTheme(); // Get theme object for colors
  const navigate = useNavigate(); // Initialize navigate function

  const handleStart = () => {
    console.log("Start button clicked");
    navigate("/process-audio"); // Navigate to ProcessAudioScreen
    // Add logic for Start button
  };

  const handleExit = () => {
    console.log("Exit button clicked");
    window.close(); // Add logic for Exit button
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      {/* Logo Section */}
      <Grid item xs={12} sm={4} md={3} align="left">
        <Box sx={{ marginBottom: "30px" }}>
          {/* Dynamically adjust the logo size */}
          <Logo width="500px" height="auto" />
        </Box>
      </Grid>

      {/* Text Section (Title and Buttons) */}
      <Grid item xs={12} sm={8} md={6} align="left">
        <Typography
          variant="h1" // Automatically inherits styles from theme.js
          sx={{
            color: theme.palette.text.dark,
            fontWeight: 700,
            textAlign: "center",
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" }, // Responsive font size
          }}
        >
          Podface
        </Typography>
        <Typography
          variant="body1" // Automatically inherits styles from theme.js
          sx={{
            color: theme.palette.text.dark,
            marginBottom: "30px",
            textAlign: "left",
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // Responsive font size
          }}
        >
          Turn Your Podcast into Facial Animation
        </Typography>

        {/* Start Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleStart}
          sx={{
            marginBottom: "20px",
            padding: "10px 20px",
            fontWeight: 600,
            textTransform: "none",
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" }, // Responsive font size
          }}
        >
          Start
        </Button>

        {/* Exit Button */}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleExit}
          sx={{
            padding: "10px 20px",
            fontWeight: 600,
            textTransform: "none",
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" }, // Responsive font size
          }}
        >
          Exit
        </Button>
      </Grid>
    </Grid>
  );
};

export default HomeScreen;
