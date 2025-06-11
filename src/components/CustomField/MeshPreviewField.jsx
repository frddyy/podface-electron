import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { MoodOutlined } from "@mui/icons-material"; // Icon fallback
import { useTheme } from "@mui/material/styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

const MeshPreviewField = ({ file, isLoading, progress }) => {
  const theme = useTheme();
  const [model, setModel] = useState(null);

  // Validasi file yang diterima
  const isValidFile = file && typeof file.path === "string";
  const fileUrl = isValidFile ? `file://${file.path}` : null;

  const boxStyles = {
    width: "100",
    height: "100",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid",
    padding: "70px 120px",
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.neutral.dark,
    color: theme.palette.neutral.dark,
    backgroundColor: theme.palette.background.form,
  }

  // Menangani proses pemuatan model
  useEffect(() => {
    if (!isValidFile) return;

    const loader = new PLYLoader();

    loader.load(
      fileUrl,
      (geometry) => {
        geometry.computeVertexNormals();  // Menghitung normal untuk pencahayaan
        const material = new THREE.MeshStandardMaterial({
          color: 'white',  // Warna model
          flatShading: true,  // Tampilan datar
        });
        const mesh = new THREE.Mesh(geometry, material); // Membuat mesh dari geometri
        mesh.rotateX(-Math.PI / 2);  // Memutar model agar sesuai
        setModel(mesh);  // Menyimpan mesh ke dalam state
      },
      undefined,
      (error) => {
        console.error("Error loading 3D model:", error);
      }
    );
  }, [fileUrl, isValidFile]);

  return (
    <div style={{ width: "100%", height: "300px" }}>
      {/* Conditional rendering for loading */}
      {isLoading ? (
        <Box sx={boxStyles}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={progress} />
            <Box
              sx={{
                top: 0, left: 0, bottom: 0, right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" color="white">
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : !isValidFile ? (
        // Show fallback error icon if loading failed
        <Box sx={boxStyles}>
          <MoodOutlined />
        </Box>
      ) : (
        // Show the 3D canvas once the model is loaded successfully
        <Canvas camera={{ position: [0, 15, 0], fov: 2 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.30} intensity={1} />
          {model && <primitive object={model} />} {/* Render loaded 3D model */}
          <OrbitControls target={model ? model.position : new THREE.Vector3(0, 0, 0)} />
          <Environment preset="night" />
        </Canvas>
      )}
      <Loader />
    </div>
  );
};

export default MeshPreviewField;
