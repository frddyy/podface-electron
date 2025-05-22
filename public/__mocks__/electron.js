// __mocks__/electron.js

const app = {
    whenReady: jest.fn(() => Promise.resolve()),
    on: jest.fn(),
  };
  
  const BrowserWindow = jest.fn().mockImplementation(() => ({
    loadURL: jest.fn(),
    close: jest.fn(),
    webContents: {
      openDevTools: jest.fn(),
    },
  }));
  
  BrowserWindow.getAllWindows = jest.fn(() => []);
  
  const ipcMain = {
    on: jest.fn(),
  };
  
  module.exports = {
    app,
    BrowserWindow,
    ipcMain,
    dialog: jest.requireActual('electron').dialog,
  };