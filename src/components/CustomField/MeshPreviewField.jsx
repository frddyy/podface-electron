// MeshPreviewField.jsx
import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { useLoader } from "@react-three/fiber";

const MeshPreviewField = ({ file }) => {
  const [model, setModel] = useState(null);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const url = URL.createObjectURL(file);
        const fileExtension = file.name.split(".").pop().toLowerCase(); // Get file extension
        let loader;

        // Load .obj file with OBJLoader
        if (fileExtension === "obj") {
          loader = new OBJLoader();
          const loadedModel = await loader.loadAsync(url);
          setModel(loadedModel);
        }

        // Load .ply file with PLYLoader
        if (fileExtension === "ply") {
          loader = new PLYLoader();
          const loadedModel = await loader.loadAsync(url);
          setModel(loadedModel);
        }
      } catch (error) {
        setLoadingError(true);
        console.error("Error loading 3D model:", error);
      }
    };

    if (file) loadModel();
  }, [file]);

  if (loadingError) {
    return <div style={{ color: "red" }}>Error loading the 3D model</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} intensity={1} />
        {model && <primitive object={model} />}
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
      <Loader />
    </div>
  );
};

export default MeshPreviewField;
