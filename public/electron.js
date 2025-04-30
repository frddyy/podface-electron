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
    // Path hasil konversi yang akan dikirimkan ke renderer
    const convertedAudioPath = '/home/daffaraihandika/TA/podface-electron/speechbrain/output/converted_speaker_1.wav'; // Sesuaikan untuk speaker_2
    event.reply('voice-conversion-complete', { convertedAudioPath }); // Kirimkan path hasil konversi
  });
});

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
