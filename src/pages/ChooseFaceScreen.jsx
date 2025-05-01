import React, { useState, useEffect } from "react";
import { Grid, Typography, Divider, Switch, ToggleButton, ToggleButtonGroup, FormControl, FormLabel, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomField from "../components/CustomField";

const ChooseFaceScreen = () => {
  const theme = useTheme();

  // State untuk kontrol Use Existing Template untuk Speaker 1 dan Speaker 2
  const [useTemplate1, setUseTemplate1] = useState(false);
  const [useTemplate2, setUseTemplate2] = useState(false);

  // State untuk pilihan gender dan template 3D
  const [gender1, setGender1] = useState("male");
  const [template1, setTemplate1] = useState(1);

  const [gender2, setGender2] = useState("female");
  const [template2, setTemplate2] = useState(1);

  // State for managing uploaded file for the 3D model
  const [file1, setFile1] = useState(null); // For Speaker 1
  const [file2, setFile2] = useState(null); // For Speaker 2

  // Fungsi untuk menangani perubahan pada switch
  const handleSwitchChange1 = (event) => {
    setUseTemplate1(event.target.checked);
  };

  const handleSwitchChange2 = (event) => {
    setUseTemplate2(event.target.checked);
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

  // Set default 3D model path when the "Use Existing Template?" switch is on for Speaker 1
  useEffect(() => {
    if (useTemplate1) {
      const modelPath = get3DModelPath(gender1, template1);
      setFile1({ path: modelPath });
    }
  }, [useTemplate1, gender1, template1]);

  // Set default 3D model path when the "Use Existing Template?" switch is on for Speaker 2
  useEffect(() => {
    if (useTemplate2) {
      const modelPath = get3DModelPath(gender2, template2);
      setFile2({ path: modelPath });
    }
  }, [useTemplate2, gender2, template2]);

  const get3DModelPath = (gender, template) => {
    const basePath = `/home/daffaraihandika/TA/podface-electron/src/assets/meshes/${gender}`;
    return `${basePath}/FLAME_sample_00${template}.ply`; // Construct the path based on the template
  };

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
      {/* Left Section */}
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
          <Typography variant="h4" sx={{ marginBottom: 1, color: "white" }}>
            Speaker 1
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <Typography sx={{ color: "white" }}>Use Existing Template?</Typography>
            </Grid>
            <Grid item xs={6}>
              <Switch
                checked={useTemplate1}
                onChange={handleSwitchChange1}
                color="primary"
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: useTemplate1 ? theme.palette.primary.main : theme.palette.neutral.dark, // Dark color when off
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: theme.palette.neutral.white, // White color for the thumb
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Speaker 1 Choose Template */}
          {useTemplate1 && (
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
          )}

          {/* Show the 3D Mesh Preview if Use Existing Template is enabled */}
          {useTemplate1 && (
            <CustomField
              mode="3d"
              labelText="3D Face Model"
              file={file1}
              setFile={setFile1}
              isPreview={true} // Show preview
            />
          )}
        </Grid>
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

      {/* Right Section */}
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
          <Typography variant="h4" sx={{ marginBottom: 1, color: "white" }}>
            Speaker 2
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <Typography sx={{ color: "white" }}>Use Existing Template?</Typography>
            </Grid>
            <Grid item xs={6}>
              <Switch
                checked={useTemplate2}
                onChange={handleSwitchChange2}
                color="primary"
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: useTemplate2 ? theme.palette.primary.main : theme.palette.neutral.dark, // Dark color when off
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: theme.palette.neutral.white, // White color for the thumb
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Speaker 2 Choose Template */}
          {useTemplate2 && (
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
          )}

          {/* Show the 3D Mesh Preview if Use Existing Template is enabled */}
          {useTemplate2 && (
            <CustomField
              mode="3d"
              labelText="3D Face Model"
              file={file2}
              setFile={setFile2}
              isPreview={true} // Show preview
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChooseFaceScreen