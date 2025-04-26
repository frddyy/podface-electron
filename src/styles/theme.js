// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      form: "#333347", // Black Russian (50)
      light: "#1A1A30", // Black Russian (100)
      default: "#000019", // Black Russian (200)
      paper: "#000017", // Black Russian (300)
    },
    primary: {
      main: "#6289FF", // Cornflower Blue (200)
      light: "#7295FF", // Cornflower Blue (100)
      dark: "#587BE6", // Cornflower Blue (300)
      contrastText: "#ffffff", // Contrast text for primary
    },
    secondary: {
      main: "#6056C6", // Indigo (200)
      light: "#7067CC", // Indigo (100)
      dark: "#564DB2", // Indigo (300)
      contrastText: "#ffffff", // Contrast text for secondary
    },
    tertiary: {
      main: "#AI3EB3", // Vivid Violet (200)
      light: "#AA51BB", // Vivid Violet (100)
      dark: "#9138A1", // Vivid Violet (300)
    },
    quaternary: {
      main: "#EEC139", // Tulip Tree (200)
      light: "#F0C74D", // Tulip Tree (100)
      dark: "#D6AE33", // Tulip Tree (300)
    },
    neutral: {
      main: "#F1F1E6", // Spring Wood (200)
      light: "#F4F4EB", // Spring Wood (100)
      dark: "#D9D9CF", // Spring Wood (300)
    },
    info: {
      main: "#99C1FF", // Malibu (50)
      light: "#8DBAFF", // Malibu (100)
      dark: "#8082FF", // Malibu (200)
    },
    success: { main: "#61E4C5" }, // Turqoise Blue (200)
    warning: { main: "#FFD465" }, // Dandelion (200)
    error: { main: "#FF9692" }, // Mona Lisa (200),
    text: {
      light: "#1A1A30", // Background light (Black Russian 100)
      dark: "#F4F4EB", // Neutral light (Spring Wood 100)
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", sans-serif', // Menentukan font keluarga global

    // Heading
    h1: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 700, // Bold
      fontSize: "6rem", // Display 1
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 600, // Semibold
      fontSize: "4rem", // Display 2
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 600, // Semibold
      fontSize: "2.25rem", // Heading 1
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 500, // Medium
      fontSize: "1.5rem", // Heading 2
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 500, // Medium
      fontSize: "1.25rem", // Heading 3
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 400, // Regular
      fontSize: "1rem", // Heading 4
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 400, // Regular
      fontSize: "1rem", // Paragraph
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 400, // Regular
      fontSize: "0.875rem", // Small text
      lineHeight: 1.5,
    },
    caption: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 400, // Regular
      fontSize: "0.75rem", // Caption text
      lineHeight: 1.4,
    },
    button: {
      fontFamily: '"SF Pro Display", sans-serif',
      fontWeight: 600, // Semibold
      fontSize: "1rem",
      textTransform: "none", // Menonaktifkan kapitalisasi untuk tombol
    },
  },
  shape: {
    borderRadius: "8px", // Mengatur radius border untuk komponen seperti Card, Button, dll.
  },
});

export default theme;
