import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { MoodOutlined } from "@mui/icons-material"; // Icon fallback
import { useTheme } from "@mui/material/styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

const MeshPreviewField = ({ file }) => {
  const theme = useTheme();
  const [model, setModel] = useState(null);
  const [loadingError, setLoadingError] = useState(false);

  // Validasi file yang diterima
  const isValidFile = file && typeof file.path === "string";
  const fileUrl = isValidFile ? `file://${file.path}` : null;

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
        setLoadingError(true);  // Menandai adanya error
      }
    );
  }, [fileUrl, isValidFile]);

  // Fallback UI jika file tidak valid atau terjadi error
  if (!isValidFile || loadingError) {
    return (
      <Box
        sx={{
          width: "100",
          height: "100", // Set a fixed height for the preview container
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid",
          padding: "70px 120px",
          borderRadius: theme.shape.borderRadius,
          borderColor: theme.palette.neutral?.dark,
          color: theme.palette.neutral.dark,
          backgroundColor: theme.palette.background.form,
        }}
      >
        <MoodOutlined />
      </Box>
    );
  }

  return (
    <div style={{ width: "100%", height: "300px" }}>
      {/* Render the 3D canvas */}
      <Canvas camera={{ position: [0, 15, 0], fov: 2 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.30} intensity={1} />
        {model && <primitive object={model} />} {/* Render loaded 3D model */}
        <OrbitControls target={model ? model.position : new THREE.Vector3(0, 0, 0)} />
        <Environment preset="night" />
      </Canvas>
      <Loader />
    </div>
  );
};

export default MeshPreviewField;
