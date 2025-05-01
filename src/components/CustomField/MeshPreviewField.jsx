import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

const MeshPreviewField = ({ file }) => {
  const [model, setModel] = useState(null);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    const loadModel = () => {
      try {
        if (file) {
          const loader = new PLYLoader();
          const fileUrl = file && file.path ? `file://${file.path}` : null;

          if (fileUrl) {
            loader.load(
              fileUrl, // Path to the .ply file
              (geometry) => {
                geometry.computeVertexNormals(); // Compute normals for shading
                const material = new THREE.MeshStandardMaterial({
                  color: 'white', // Color of the model
                  flatShading: true, // To give a faceted appearance
                });

                const mesh = new THREE.Mesh(geometry, material); // Create mesh from geometry
                mesh.rotateX(-Math.PI / 2); // Rotate the model to fit the view
                setModel(mesh); // Set the model into state
              },
              (xhr) => {
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`); // Optional: track progress
              },
              (error) => {
                setLoadingError(true);
                console.error("Error loading 3D model:", error);
              }
            );
          }
        }
      } catch (error) {
        setLoadingError(true);
        console.error("Error loading the model:", error);
      }
    };

    loadModel(); // Trigger model loading

  }, [file]); // Re-run when the file changes

  if (loadingError) {
    return <div style={{ color: "red" }}>Error loading the 3D model</div>;
  }

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Canvas camera={{ position: [0, 15, 0], fov: 2 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.30} intensity={1} />
        {model && <primitive object={model} />} {/* Render the loaded 3D model */}
        <OrbitControls target={model ? model.position : new THREE.Vector3(0, 0, 0)} />
        <Environment preset="night" />
      </Canvas>
      <Loader />
    </div>
  );
};

export default MeshPreviewField;
