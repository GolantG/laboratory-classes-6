const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const http = require('http');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  const checkServer = () => {
    http.get('http://localhost:3000', () => {
      mainWindow.loadURL('http://localhost:3000');
      mainWindow.webContents.openDevTools();
      mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
      });
    }).on('error', () => {
      setTimeout(checkServer, 500);
    });
  };

  checkServer();
}

app.whenReady().then(() => {
  const serverProcess = exec('npm start');

  createWindow();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      serverProcess.kill();
      app.quit();
    }
  });
});
