import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

async function startBackendServer() {
  try {
    // Import express server directly using embedded Electron Node.js engine
    await import('../server/index.js');
    console.log('🚀 Embedded Express backend started successfully');
  } catch (err) {
    console.error('Embedded server startup info/error:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 600,
    title: 'SHREE JANANI HOSPITAL SOFTWARE',
    icon: path.join(__dirname, '..', 'public', 'desktop-icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true
  });

  mainWindow.maximize();

  const isDev = !app.isPackaged && process.env.NODE_ENV === 'development';

  if (isDev) {
    console.log('🖥️ Loading Dev URL: http://localhost:5173');
    mainWindow.loadURL('http://localhost:5173');
  } else {
    const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');
    console.log('🖥️ Loading Packaged App File:', distIndexPath);
    mainWindow.loadFile(distIndexPath);
  }

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startBackendServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
