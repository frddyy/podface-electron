// src/App.js
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router } from "react-router-dom"; // Untuk routing
import theme from "./styles/theme"; // Mengimpor tema
import AppRoutes from "./routes/AppRoutes"; // Mengimpor AppRoutes yang sudah kita buat

const App = () => {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl1") || canvas.getContext("webgl");
  console.log(gl);

  if (!gl) {
    console.log("WebGL not supported");
  } else {
    console.log("WebGL supported");
  }


  return (
    <ThemeProvider theme={theme}>
      <Router>
        {/* Menggunakan AppRoutes untuk mengatur routing dan layout */}
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
