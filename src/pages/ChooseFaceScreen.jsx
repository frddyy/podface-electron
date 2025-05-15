import React, { useState, useEffect } from "react";
import { Grid, Typography, Divider, Switch, ToggleButton, ToggleButtonGroup, Radio, RadioGroup, FormControlLabel, Button, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomField from "../components/CustomField";
import { useFaceModelContext } from "../context/FaceModelContext"; 

const ChooseFaceScreen = () => {
  const theme = useTheme();

  const {
    isUseTemplate1, setIsUseTemplate1,
    isUseTemplate2, setIsUseTemplate2,
    gender1, setGender1,
    template1, setTemplate1,
    gender2, setGender2,
    template2, setTemplate2,
    imageFile1, setImageFile1,
    reconstructedFile1, setReconstructedFile1,
    templateFile1, setTemplateFile1,
    imageFile2, setImageFile2,
    reconstructedFile2, setReconstructedFile2,
    templateFile2, setTemplateFile2,
    setFinalFace,
    isReconstruction1Loading, setIsReconstruction1Loading,
    isReconstruction2Loading, setIsReconstruction2Loading
  } = useFaceModelContext(); // Get context values and functions

  const [snackbarOpen, setSnackbarOpen] = useState(false);  
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fungsi untuk menangani perubahan pada switch
  const handleSwitchChange1 = (event) => {
    setIsUseTemplate1(event.target.checked);
  };

  const handleSwitchChange2 = (event) => {
    setIsUseTemplate2(event.target.checked);
  };

  // Fungsi untuk menangani perubahan pada gender untuk Speaker 1
  const handleGenderChange1 = (event) => {
    setGender1(event.target.value);
  };

  // Fungsi untuk menangani perubahan pada gender untuk Speaker 2
  const handleGenderChange2 = (event) => {
    setGender2(event.target.value);
  };

  // Fungsi untuk menangani perubahan pada template 3D untuk Speaker 1
  const handleTemplateChange1 = (event) => {
    setTemplate1(Number(event.target.value));
  };

  // Fungsi untuk menangani perubahan pada template 3D untuk Speaker 2
  const handleTemplateChange2 = (event) => {
    setTemplate2(Number(event.target.value));
  };

  // Function to handle opening file dialog for Speaker 1 (Image upload)
  const handleOpenImageDialog1 = () => {
    const { ipcRenderer } = window.require("electron");

    ipcRenderer.send("open-image-file-dialog");

    ipcRenderer.once("image-file-selected", (event, data) => {
      const imageURL = data.imageFilePath;
      console.log("Received image URL: ", imageURL);
      setImageFile1({ path: imageURL });
    });

    ipcRenderer.once("invalid-image-file", (event, data) => {
      // If the file is invalid, show an error message in Snackbar
      setSnackbarMessage(data.message);
      setSnackbarOpen(true);
    });
  };

  // Function to handle Apply button click for Speaker 1
  const handleApplyClick1 = () => {
    console.log("Applying face model for Speaker 1...");

    // Start the MICA face reconstruction process
    const { ipcRenderer } = window.require("electron");

    if (!imageFile1) {
      console.error("No image file uploaded for Speaker 1.");
      return;
    }

    setIsReconstruction1Loading(true)
  
    const imageFolder = imageFile1.path; 
    const outputFolder = "/home/daffaraihandika/TA/podface-electron/src/assets/meshes/";
    const speaker = 'speaker_1'; 

    // Send IPC message to Electron main process to run MICA face reconstruction
    ipcRenderer.send("run-mica", {
      imageFolder: imageFolder,  // Path to the image
      outputFolder: outputFolder,  // Output folder
      speaker: speaker  // Pass the speaker argument
    });

    // Mendengarkan feedback setelah konversi selesai
    ipcRenderer.once("face-postprocessing-complete", (event, data) => {
      // console.log("Face reconstruction feedback:", data);
      console.log("Face reconstruction and postprocessing successfull");
      setReconstructedFile1({ path: "/home/daffaraihandika/TA/podface-electron/src/assets/meshes/transformed_speaker_1.ply" });
      setIsReconstruction1Loading(false)
    });
  };

  // Function to handle opening file dialog for Speaker 2 (Image upload)
  const handleOpenImageDialog2 = () => {
    const { ipcRenderer } = window.require("electron");

    ipcRenderer.send("open-image-file-dialog");

    ipcRenderer.once("image-file-selected", (event, data) => {
      const imageURL = data.imageFilePath;
      console.log("Received image URL: ", imageURL);
      setImageFile2({ path: imageURL });
    });

    ipcRenderer.once("invalid-image-file", (event, data) => {
      // If the file is invalid, show an error message in Snackbar
      setSnackbarMessage(data.message);
      setSnackbarOpen(true);
    });
  };

  // Function to handle Apply button click for Speaker 2
  const handleApplyClick2 = () => {
    console.log("Applying face model for Speaker 2...");

    // Start the MICA face reconstruction process
    const { ipcRenderer } = window.require("electron");

    if (!imageFile2) {
      console.error("No image file uploaded for Speaker 2.");
      return;
    }
  
    setIsReconstruction2Loading(true)

    const imageFolder = imageFile2.path; 
    const outputFolder = "/home/daffaraihandika/TA/podface-electron/src/assets/meshes/";
    const speaker = 'speaker_2'; 

    // Send IPC message to Electron main process to run MICA face reconstruction
    ipcRenderer.send("run-mica", {
      imageFolder: imageFolder,  // Path to the image
      outputFolder: outputFolder,  // Output folder
      speaker: speaker  // Pass the speaker argument
    });

    // Mendengarkan feedback setelah konversi selesai
    ipcRenderer.once("face-postprocessing-complete", (event, data) => {
      console.log("Face reconstruction and postprocessing successfull");
      setReconstructedFile2({ path: "/home/daffaraihandika/TA/podface-electron/src/assets/meshes/transformed_speaker_2.ply" });
      setIsReconstruction2Loading(false)
    });
  };

  // Set default 3D model path when the "Use Existing Template?" switch is on for Speaker 1
  useEffect(() => {
    if (isUseTemplate1) {
      const modelPath = get3DModelPath(gender1, template1);
      setTemplateFile1({ path: modelPath });
    }
  }, [isUseTemplate1, gender1, template1]);

  // Set default 3D model path when the "Use Existing Template?" switch is on for Speaker 2
  useEffect(() => {
    if (isUseTemplate2) {
      const modelPath = get3DModelPath(gender2, template2);
      setTemplateFile2({ path: modelPath });
    }
  }, [isUseTemplate2, gender2, template2]);

  const get3DModelPath = (gender, template) => {
    const basePath = `/home/daffaraihandika/TA/podface-electron/src/assets/meshes/${gender}`;
    return `${basePath}/FLAME_sample_00${template}.ply`; // Construct the path based on the template
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // useEffect to update the final face model whenever the relevant states change
  useEffect(() => {
    // Only set final face if necessary (either using template or reconstructed face)
    setFinalFace();
  }, [reconstructedFile1, reconstructedFile2, isUseTemplate1, isUseTemplate2, setFinalFace]);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 3, // Increased gap between left and right section
        flexWrap: "wrap", // Allow content to wrap and adjust height dynamically
      }}
    >
      {/* Left Section for Speaker 1 */}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minHeight: "50vh", // Allow height to adjust based on content
          width: "fit-content",
          minWidth: "350px"
        }}
      >
        {/* Speaker 1 */}
        <Typography variant="h4" sx={{ marginBottom: 1, color: "white" }}>
          Speaker 1
        </Typography>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6}>
            <Typography sx={{ color: "white" }}>Use Existing Template?</Typography>
          </Grid>
          <Grid item xs={6}>
            <Switch
              checked={isUseTemplate1}
              onChange={handleSwitchChange1}
              color="primary"
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: isUseTemplate1 ? theme.palette.primary.main : theme.palette.neutral.dark, // Dark color when off
                },
                "& .MuiSwitch-thumb": {
                  backgroundColor: theme.palette.neutral.white, // White color for the thumb
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Speaker 1 Choose Template */}
        {isUseTemplate1 ? (
          <>            
            <Grid container alignItems="center" spacing={2}>
              {/* Gender Selection with Toggle Button */}
              <Grid item xs={6}>
                <ToggleButtonGroup
                  value={gender1}
                  exclusive
                  onChange={handleGenderChange1}
                  aria-label="gender selection"
                  sx={{
                    "& .MuiToggleButton-root": {
                      color: 'white', // White text color for both options
                      border: `1px solid ${theme.palette.primary.main}`, // Border color for the buttons
                    },
                  }}
                  fullWidth={false}
                  size="small"
                >
                  <ToggleButton value="male" color="primary">Male</ToggleButton>
                  <ToggleButton value="female" color="primary">Female</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {/* 3D Face Template Selection */}
              <Grid item xs={6}>
                <RadioGroup
                  row
                  value={template1}
                  onChange={handleTemplateChange1}
                >
                  {[1, 2, 3, 4, 5].map((temp) => (
                    <FormControlLabel
                      key={temp}
                      value={temp.toString()}
                      control={<Radio />}
                      label={temp}
                      sx={{
                        color: 'white',
                        '& .MuiRadio-root': {
                          color: 'white',
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </Grid>
            </Grid>

            <CustomField
              mode="3d"
              labelText="3D Face Model"
              file={templateFile1}
              setFile={setTemplateFile1}
              isPreview={true} // Show preview
              hideRemoveButton={true}
            />
          </>
        ) : (
          <>
            <Grid container spacing={2}>
              {/* Left side: Input Image */}
              <Grid item xs={6}>
                <CustomField
                  mode="image"
                  labelText="Input Image"
                  file={imageFile1}
                  setFile={setImageFile1}
                  onOpenFileDialog={handleOpenImageDialog1}
                  isPreview={false} // No preview for image
                />
              </Grid>

              {/* Right side: Reconstructed 3D Face Model */}
              <Grid item xs={6}>
                {/* This is shown if the user is not using the template */}
                {!isUseTemplate1 && (
                  <CustomField
                    mode="3d"
                    labelText="Reconstructed 3D Face Model"
                    file={reconstructedFile1}
                    setFile={setReconstructedFile1}
                    isPreview={true} // Show preview
                    isLoading={isReconstruction1Loading}
                  />
                )}
              </Grid>
            </Grid>

            {/* Button Apply below the image and 3D model */}
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 600,
                textTransform: "none",
                maxWidth: 100,
                alignSelf: "flex-end", // Align to the right
                marginTop: 2, // Optional: space between components
              }}
              disabled={!imageFile1}
              onClick={handleApplyClick1}
            >
              Apply
            </Button>
          </>
        )}
      </Grid>

      {/* Divider with white color */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: "100",
          border: "0.5px solid",
          borderColor: theme.palette.neutral.dark, // Set the divider color
        }}
      />

      {/* Right Section for Speaker 2 */}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minHeight: "50vh", // Allow height to adjust based on content
          width: "fit-content",
          minWidth: "350px"
        }}
      >
        {/* Speaker 2 */}
        <Typography variant="h4" sx={{ marginBottom: 1, color: "white" }}>
          Speaker 2
        </Typography>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6}>
            <Typography sx={{ color: "white" }}>Use Existing Template?</Typography>
          </Grid>
          <Grid item xs={6}>
            <Switch
              checked={isUseTemplate2}
              onChange={handleSwitchChange2}
              color="primary"
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: isUseTemplate2 ? theme.palette.primary.main : theme.palette.neutral.dark, // Dark color when off
                },
                "& .MuiSwitch-thumb": {
                  backgroundColor: theme.palette.neutral.white, // White color for the thumb
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Speaker 2 Choose Template */}
        {isUseTemplate2 ? (
          <>            
            <Grid container alignItems="center" spacing={2}>
              {/* Gender Selection with Toggle Button */}
              <Grid item xs={6}>
                <ToggleButtonGroup
                  value={gender2}
                  exclusive
                  onChange={handleGenderChange2}
                  aria-label="gender selection"
                  sx={{
                    "& .MuiToggleButton-root": {
                      color: 'white', // White text color for both options
                      border: `1px solid ${theme.palette.primary.main}`, // Border color for the buttons
                    },
                  }}
                  fullWidth={false}
                  size="small"
                >
                  <ToggleButton value="male" color="primary">Male</ToggleButton>
                  <ToggleButton value="female" color="primary">Female</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {/* 3D Face Template Selection */}
              <Grid item xs={6}>
                <RadioGroup
                  row
                  value={template2}
                  onChange={handleTemplateChange2}
                >
                  {[1, 2, 3, 4, 5].map((temp) => (
                    <FormControlLabel
                      key={temp}
                      value={temp.toString()}
                      control={<Radio />}
                      label={temp}
                      sx={{
                        color: 'white',
                        '& .MuiRadio-root': {
                          color: 'white',
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </Grid>
            </Grid>

            <CustomField
              mode="3d"
              labelText="3D Face Model"
              file={templateFile2}
              setFile={setTemplateFile2}
              isPreview={true} // Show preview
            />
          </>
        ) : (
          <>
            <Grid container spacing={2}>
              {/* Left side: Input Image */}
              <Grid item xs={6}>
                <CustomField
                  mode="image"
                  labelText="Input Image"
                  file={imageFile2}
                  setFile={setImageFile2}
                  onOpenFileDialog={handleOpenImageDialog2}
                  isPreview={false} // No preview for image
                />
              </Grid>

              {/* Right side: Reconstructed 3D Face Model */}
              <Grid item xs={6}>
                {/* This is shown if the user is not using the template */}
                {!isUseTemplate2 && (
                  <CustomField
                    mode="3d"
                    labelText="Reconstructed 3D Face Model"
                    file={reconstructedFile2}
                    setFile={setReconstructedFile2}
                    isPreview={true} // Show preview
                    isLoading={isReconstruction2Loading}
                  />
                )}
              </Grid>
            </Grid>

            {/* Button Apply below the image and 3D model */}
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 600,
                textTransform: "none",
                maxWidth: 100,
                alignSelf: "flex-end", // Align to the right
                marginTop: 2, // Optional: space between components
              }}
              disabled={!imageFile2}
              onClick={handleApplyClick2}
            >
              Apply
            </Button>
          </>
        )}
      </Grid>
      {/* Snackbar for invalid file format */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default ChooseFaceScreen;