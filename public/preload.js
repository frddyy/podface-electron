const { contextBridge, ipcRenderer } = require("electron");

// Expose specific API to renderer process
contextBridge.exposeInMainWorld("electron", {
  sendToMain: (data) => ipcRenderer.send("START_BACKGROUND_VIA_MAIN", data),
  onMessageFromMain: (callback) =>
    ipcRenderer.on("MESSAGE_FROM_BACKGROUND_VIA_MAIN", callback),
});
