import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Tabs, Tab, Box, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Logo from "./Logo";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { useAudioContext } from "../context/AudioContext";
import { useRenderContext } from "../context/RenderContext";
import { usePodcastContext } from "../context/PodcastContext";

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
  const { finalAudio1, finalAudio2 } = useAudioContext();
  const { videoFile1, videoFile2 } = useRenderContext();
  const { setVideoPodcastFile, setIsPodcastMerged } = usePodcastContext();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (videoFile1 && videoFile2 && videoFile1.path && videoFile2.path) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [videoFile1, videoFile2]);

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
    const currentPath = window.location.pathname;
    console.log("Video 1: ", videoFile1 ? videoFile1.path : "Video 1 is null");
    console.log("Video 2: ", videoFile2 ? videoFile2.path : "Video 2 is null");

    // Cek apakah kita berada di halaman AnimateRenderScreen
    if (currentPath === "/animate-render") {

      if (!isReady) {
        console.log("One or both video files are not ready yet.");
        navigate("/result");
        return; // Menghentikan proses jika file video belum ada
      }

      // Jalankan handleCombineAudio terlebih dahulu sebelum melanjutkan
      const { ipcRenderer } = window.require("electron");
      const combinedAudioPath = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/combined_audio.wav";

      // Kirimkan permintaan ke main process untuk menggabungkan audio
      ipcRenderer.send("combine-audio", {
        audioPath1: finalAudio1.path,  // Gunakan finalAudio1 dan finalAudio2 dari context
        audioPath2: finalAudio2.path,
        outputPath: combinedAudioPath,
      });

      // Menunggu balasan dari main process setelah penggabungan audio selesai
      ipcRenderer.once("audio-combined", (event, data) => {
        console.log(data)
      });

      // Setelah penggabungan audio selesai, lanjutkan dengan merge-podcasts
      ipcRenderer.send("merge-podcasts", {
        video1Path: videoFile1.path,
        video2Path: videoFile2.path,
        audioPath: combinedAudioPath, // Path audio gabungan
        outputPath: "/home/daffaraihandika/TA/podface-electron/src/assets/video/final_podcast.mp4", // Path output final podcast
      });

      // Menunggu balasan dari main process setelah penggabungan video dan audio selesai
      ipcRenderer.once("podcast-merged", (event, data) => {
        console.log(data)
        setVideoPodcastFile({
          path: data.output
        });        
        setIsPodcastMerged(true);
      });
      navigate("/result");
    } else {
      // Lanjutkan ke halaman berikutnya jika tidak di AnimateRenderScreen
      if (currentPath === "/process-audio") {
        navigate("/modify-voice");
      } else if (currentPath === "/modify-voice") {
        navigate("/choose-face");
      } else if (currentPath === "/choose-face") {
        navigate("/animate-render");
      } else if (currentPath === "/result") {
        navigate("/");  // Kembali ke Home Screen atau halaman lain
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
        alignItems="start"
        sx={{
          marginTop: "50px",
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
