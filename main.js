const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, 'src/index.js'),
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('src/index.html');

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('onWebcontentsValue', 'on load...');
    });
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipcMain.on('menu-click', (event, menuIndex) => {
        if (menuIndex === 2) {
            mainWindow.loadFile('src/second.html');
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
