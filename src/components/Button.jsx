// src/components/Button.js
import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({
  variant,
  color,
  onClick,
  children,
  fullWidth = false,
}) => {
  return (
    <Button
      variant={variant || "contained"} // Default to contained if variant not passed
      color={color || "primary"} // Default to primary if color not passed
      fullWidth={fullWidth} // Makes the button take full width of its container
      onClick={onClick}
      sx={{
        marginBottom: "20px", // Adds space below the button
        padding: "10px 20px",
        textTransform: "none", // Prevents text from being capitalized
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
