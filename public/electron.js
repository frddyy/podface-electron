const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { PythonShell } = require("python-shell");
const path = require("path");
const fs = require("fs");

let mainWindow;

// app.disableHardwareAcceleration(); // Disable hardware acceleration for WebGL issues

// app.commandLine.appendSwitch("disable-gpu");
// app.commandLine.appendSwitch("use-gl", "desktop");
// app.commandLine.appendSwitch('v', '1'); // Enable verbose logging
// app.commandLine.appendSwitch("no-sandbox");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
      nodeIntegration: true, // Keamanan lebih baikwebgl: true, // Enable WebGL    },
      webgl: true,
      webSecurity: false, // Disable web security to allow local file access
    },
  });

  mainWindow.loadURL("http://localhost:3000"); // Pastikan React berjalan
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle file open dialog
ipcMain.on("open-file-dialog", async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
  });

  if (!result.canceled) {
    const filePath = result.filePaths[0]; // Get the absolute file path
    console.log("Selected file path: ", filePath);
    event.reply("file-selected", { filePath }); // Send the absolute path to renderer
  } else {
    console.log("No file selected.");
  }
});

// Handle "separate-audio" event for processing audio
ipcMain.on("separate-audio", (event, args) => {
  console.log("Starting audio separation...");
  const audioPath = args.audioPath;
  console.log("Received audioPath in main process:", audioPath);

  const options = {
    pythonPath: '/home/daffaraihandika/TA/speechbrain/speechbrain_env/bin/python',  // Path to your Python executable
    scriptPath: path.join(__dirname, '../scripts'),  // Path to your Python scripts folder
    args: [audioPath],  // Pass the audio file path to the Python script
  };

  runPythonScript('separate_audio.py', options, "Audio separation completed", "Error executing audio separation:", event, (event) => {
    // Kirimkan path hasil pemisahan audio ke renderer setelah proses selesai
    const separatedAudioPaths = {
      speaker1: '/home/daffaraihandika/TA/podface-electron/speechbrain/output/enhanced_speaker_1.wav',
      speaker2: '/home/daffaraihandika/TA/podface-electron/speechbrain/output/enhanced_speaker_2.wav'
    };
    event.reply('audio-separation-complete', separatedAudioPaths); // Kirimkan path file ke renderer
  });
});

// Fungsi untuk menjalankan voice conversion menggunakan Seed-VC
ipcMain.on("voice-conversion", (event, args) => {
  console.log("Starting voice conversion with Seed-VC...");

  // Path output dinamis untuk Speaker 1 dan Speaker 2
  const speaker1Output = `/home/daffaraihandika/TA/podface-electron/speechbrain/output/converted_speaker_1.wav`;
  const speaker2Output = `/home/daffaraihandika/TA/podface-electron/speechbrain/output/converted_speaker_2.wav`;

  const options = {
    pythonPath: '/home/daffaraihandika/TA/seed-vc/seed_env/bin/python',  // Path ke venv Python di dalam Seed-VC
    scriptPath: '/home/daffaraihandika/TA/seed-vc',  // Lokasi folder Seed-VC
    args: [
      '--source', args.inputAudioPath,  // Path audio input untuk konversi
      '--target', args.targetAudioPath,  // Path audio target untuk konversi
      '--output', '/home/daffaraihandika/TA/podface-electron/speechbrain/output',
      '--speaker', args.speaker,
    ],
    mode: 'text',
    pythonOptions: ['-u'],
  };

  // Menjalankan voice conversion dan memberikan feedback ke frontend
  runPythonScript('inference.py', options, "Voice conversion completed successfully!", "Error during voice conversion:", event, (event) => {
    // Kirimkan path hasil konversi untuk speaker 1 dan speaker 2
    const convertedAudioPaths = {
      speaker1: speaker1Output,  // Path untuk speaker 1
      speaker2: speaker2Output   // Path untuk speaker 2
    };
    event.reply('voice-conversion-complete', { convertedAudioPaths }); // Kirimkan path hasil konversi
  });
});

// Handle the "run-mica" event for face reconstruction
ipcMain.on("run-mica", (event, args) => {
  console.log("Starting MICA face reconstruction...");

  const imageFolder = args.imageFolder;
  const outputFolder = args.outputFolder;
  const speaker = args.speaker;

  const pretrainedModelPath = '/home/daffaraihandika/face-reconstruction/MICA/data/pretrained/mica.tar'; // Path to the pretrained MICA model

  const options = {
    pythonPath: '/home/daffaraihandika/miniconda3/envs/MICA/bin/python', // Path to Python executable in MICA environment
    scriptPath: '/home/daffaraihandika/face-reconstruction/MICA',  // Path to MICA folder
    args: [
      '-i', imageFolder,  // Input image folder
      '-o', outputFolder, // Output folder for 3D models
      '-m', pretrainedModelPath, // Pretrained MICA model path
      '-s', speaker  // Pass the speaker argument to Python script
    ],
    mode: 'text',
    pythonOptions: ['-u'],
  };

  // Run the MICA face reconstruction Python script
  runPythonScript("demo.py", options, "MICA processing completed successfully!", "Error during MICA processing:", event, (event) => {
    console.log("MICA processing complete, starting postprocessing...");

    // Call the face postprocessing function after MICA completion
    runFacePostprocessing(event, outputFolder, speaker);  // Pass event, outputFolder, and speaker to face postprocessing
  });
});

// Handle the "run-voca" event for speech-driven facial animation
ipcMain.on("run-voca", (event, args) => {
  console.log("Starting VOCA script...");

  const graphPath = "/home/daffaraihandika/voca/ds_graph/output_graph.pb";
  const modelPath = "/home/daffaraihandika/voca/model/gstep_52280.model";

  // Step 1: Run VOCA for facial animation
  const options = {
    pythonPath: "/home/daffaraihandika/voca/voca_env/bin/python",  // Path to Python environment
    scriptPath: "/home/daffaraihandika/voca",  // Path to VOCA folder
    args: [
      '--audio_fname', args.audioPath,
      '--template_fname', args.templatePath,
      '--out_path', args.outputPath,
      '--ds_fname', graphPath,
      '--tf_model_fname', modelPath,
    ],
    mode: 'text',
    pythonOptions: ['-u'],
  };

  // Run the VOCA script
  runPythonScript('run_voca.py', options, "VOCA script executed successfully!", "Error executing VOCA script:", event, () => {
    // After VOCA completes, send a success message to the frontend
    console.log("VOCA processing completed!");
    event.reply("voca-processing-complete", { message: "VOCA script executed successfully!" });
  });
});

// Step 2: Add eye blink to the animation
function addEyeBlink(event, args) {
  console.log("Adding eye blink...");

  const animationOutputPath = args.outputPath;  // Path to VOCA output (animation)
  const flameEyeBlinkPath = path.join(animationOutputPath, "eye_blink");  // Path to store eye blink

  const options = {
    pythonPath: "/home/daffaraihandika/voca/voca_env/bin/python",
    scriptPath: "/home/daffaraihandika/voca",
    args: [
      '--source_path', path.join(animationOutputPath, '/meshes'),
      '--out_path', flameEyeBlinkPath,
      '--flame_model_path', args.flameModelPath,  // FLAME model path
      '--mode', 'blink',
      '--num_blinks', '2',
      '--blink_duration', '15'
    ],
    mode: 'text',
    pythonOptions: ['-u'],
  };

  // Run the script to add eye blink to the animation
  runPythonScript('edit_sequences.py', options, "Eye blink added successfully!", "Error adding eye blink:", event, () => {
    // After eye blink, visualize the animation sequence
    visualizeSequence(event, args);
  });
}

// Step 3: Visualize the sequence (render the animation)
function visualizeSequence(event, args) {
  console.log("Visualizing sequence...");

  const flameEyeBlinkPath = path.join(args.outputPath, 'eye_blink');
  
  const options = {
    pythonPath: "/home/daffaraihandika/voca/voca_env/bin/python",
    scriptPath: "/home/daffaraihandika/voca", 
    args: [
      '--sequence_path', path.join(flameEyeBlinkPath, '/meshes'),
      '--audio_fname', args.audioPath,
      '--out_path', flameEyeBlinkPath  // Folder to store the rendered animation
    ],
    mode: 'text',
    pythonOptions: ['-u'],
  };

  // Run the visualization script to render the final animation
  runPythonScript('visualize_sequence.py', options, "3D facial animation completed!", "Error visualizing sequence:", event, () => {
    event.reply("animation-complete", { message: "Facial animation with eye blink and visualization completed!" });
  });
}

// Function to run the Python script and send feedback to the frontend
function runPythonScript(scriptName, options, successMessage, errorMessage, event, nextFunction) {
  const pyshell = new PythonShell(scriptName, options);

  // Capture real-time logs from the Python script
  pyshell.on('message', (message) => {
    console.log(message);  // Log real-time output in the terminal
  });

  // Handle Python script results
  pyshell.end((err, code, signal) => {
    if (err) {
      console.error(errorMessage, err);
      event.reply(errorMessage, { error: err.message });
    } else {
      console.log(successMessage);
      // Send the success message to the frontend
      event.reply("feedback", { message: successMessage });

      // Call the next function (if any) after processing
      if (nextFunction) {
        nextFunction(event);
      }
    }
  });
}

// Fungsi untuk menjalankan face postprocessing
function runFacePostprocessing(event, outputFolder, speaker) {
  console.log("Starting face postprocessing...");

  const micaMeshPath = path.join(outputFolder, `reconstructed_${speaker}.ply`);
  const alignedMeshPath = path.join(outputFolder, `transformed_${speaker}.ply`);

  const options = {
    pythonPath: '/home/daffaraihandika/miniconda3/envs/MICA/bin/python',
    scriptPath: path.join(__dirname, '../scripts'),
    args: [micaMeshPath, alignedMeshPath],
    mode: 'text',
    pythonOptions: ['-u'],
  };

  runPythonScript('face_postprocessing.py', options, "Face postprocessing completed successfully!", "Error during face postprocessing:", event, () => {
    console.log("Face postprocessing completed!");
    event.reply("face-postprocessing-complete", { message: "Face postprocessing completed!" });
  });
}
