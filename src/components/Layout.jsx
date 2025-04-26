import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Tabs, Tab, Box, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Logo from "./Logo";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

const Layout = ({
  children,
  showHeader = true,
  showFooter = true, // Prop to determine if footer should be shown
  isResultScreen = false, // Prop to determine if we are on the Result screen
}) => {
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Access current location

  // Determine the active tab based on the current route
  const [activeTab, setActiveTab] = useState(0);

  // Update activeTab when location changes
  useEffect(() => {
    switch (location.pathname) {
      case "/process-audio":
        setActiveTab(0);
        break;
      case "/modify-voice":
        setActiveTab(1);
        break;
      case "/choose-face":
        setActiveTab(2);
        break;
      case "/animate-render":
        setActiveTab(3);
        break;
      case "/result":
        setActiveTab(4);
        break;
      default:
        setActiveTab(0);
    }
  }, [location.pathname]); // Re-run the effect when location changes

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleNext = () => {
    if (isResultScreen) {
      // If we are on Result Screen, navigate to the home page or a different endpoint
      navigate("/"); // Finish, go back to the home screen or another endpoint
    } else {
      // Navigate to the next step based on the current path
      const currentPath = window.location.pathname;

      if (currentPath === "/process-audio") {
        navigate("/modify-voice"); // Navigate to ModifyVoiceScreen
      } else if (currentPath === "/modify-voice") {
        navigate("/choose-face"); // Navigate to ChooseFaceScreen
      } else if (currentPath === "/choose-face") {
        navigate("/animate-render"); // Navigate to AnimateRenderScreen
      } else if (currentPath === "/animate-render") {
        navigate("/result"); // Navigate to ResultScreen
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Keep this to make sure the layout fills the viewport
      }}
    >
      {/* Header */}
      {showHeader && (
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: "none",
            paddingTop: "10px",
            marginTop: "10px",
          }}
        >
          <Toolbar sx={{ alignSelf: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "auto",
                gap: 5,
              }}
            >
              {/* Logo */}
              <Logo width="100px" height="auto" />

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)} // Change active tab
                textColor="inherit"
                indicatorColor="primary"
              >
                <Tab label="Process Audio" />
                <Tab label="Modify Voice" />
                <Tab label="Choose Face" />
                <Tab label="Animate & Render" />
                <Tab label="Result" />
              </Tabs>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{
          p: 3,
          flexGrow: 1, // Allow grid to take available space and center content
          overflow: "auto", // Allow content overflow for larger content
        }}
      >
        {children} {/* Page-specific content */}
      </Grid>

      {/* Footer with navigation buttons */}
      {showFooter && (
        <Box
          sx={{
            position: "sticky", // This keeps the footer always at the bottom of the content
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            alignSelf: "flex-end",
            justifyContent: "center", // Center align the buttons
            gap: 2,
            margin: 3,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBack}
            sx={{ textTransform: "none" }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{ textTransform: "none" }}
          >
            {isResultScreen ? "Finish" : "Next"}
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Layout;
