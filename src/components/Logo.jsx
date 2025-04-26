// src/components/Logo.js
import React from "react";
import { Box } from "@mui/material";
import PodfaceLogo from "../assets/images/podface-logo@2x.png";

const Logo = ({ width = "150px", height = "auto" }) => {
  return (
    <Box
      component="img"
      src={PodfaceLogo} // Path ke logo Anda di folder public/assets/
      alt="Podface Logo"
      sx={{
        width: width,
        height: height,
      }}
    />
  );
};

export default Logo;
