const { app, BrowserWindow, ipcMain } = require("electron");
const { PythonShell } = require("python-shell");
const path = require("path");

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
      //   preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
      nodeIntegration: true, // Keamanan lebih baikwebgl: true, // Enable WebGL    },
      webgl: true,
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

// Menangani permintaan untuk menjalankan script Python
ipcMain.on("START_BACKGROUND_VIA_MAIN", (event, args) => {
  const pythonScript = path.join(__dirname, "../scripts/factorial.py");

  let pyshell = new PythonShell(pythonScript, {
    pythonPath: "python3", // Atau 'python' tergantung konfigurasi Python Anda
    args: [args.number],
  });

  // Menangani output dari Python
  pyshell.on("message", (message) => {
    console.log("Python output:", message);
    mainWindow.webContents.send("MESSAGE_FROM_BACKGROUND_VIA_MAIN", message);
  });

  pyshell.on("stderr", (stderr) => {
    console.error("Python error:", stderr);
  });

  pyshell.on("close", () => {
    console.log("Python process finished");
  });
});
