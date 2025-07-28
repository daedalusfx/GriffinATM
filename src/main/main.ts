// =================================================================
// FILE: src/main.ts
// توضیحات: نسخه بهبودیافته با صف پایدار، اعتبارسنجی و اندپوینت بازخورد
// =================================================================
import path from 'path';
import fs from 'fs'; // --- بهبود: ماژول فایل سیستم برای پایداری صف
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import http from 'http';
import express from 'express';
import WebSocket from 'ws';

// --- تعریف نوع داده‌ها
interface Command {
  action: string;
  ticket?: number;
  settings?: object;
  atm_trade_state?: boolean;
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// --- راه‌اندازی سرور
const expressApp = express();
const server = http.createServer(expressApp);
const wss = new WebSocket.Server({ server });
const PORT = 5000;

expressApp.use(express.json());

// --- بهبود: صف پایدار برای دستورات ---
const COMMAND_QUEUE_FILE = path.join(app.getPath('userData'), 'commandQueue.json');
let commandQueue: Command[] = [];

function saveQueueToFile() {
  try {
    fs.writeFileSync(COMMAND_QUEUE_FILE, JSON.stringify(commandQueue, null, 2));
  } catch (error) {
    console.error("🔴 Failed to save command queue:", error);
  }
}

function loadQueueFromFile() {
  try {
    if (fs.existsSync(COMMAND_QUEUE_FILE)) {
      const data = fs.readFileSync(COMMAND_QUEUE_FILE, 'utf-8');
      commandQueue = JSON.parse(data);
      console.log(`✅ Command queue loaded with ${commandQueue.length} items.`);
    }
  } catch (error) {
    console.error("🔴 Failed to load command queue:", error);
    commandQueue = [];
  }
}
// ------------------------------------

let currentTradeRule = {};
const clients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'settings', data: currentTradeRule }));
  ws.on('close', () => clients.delete(ws));
});

function broadcast(messageObject: object) {
  const message = JSON.stringify(messageObject);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(message);
  });
}

// --- بهبود: اندپوینت جدید برای دریافت بازخورد از اکسپرت ---
expressApp.post('/feedback', (req, res) => {
  const feedback = req.body;
  // بهبود: اعتبارسنجی ورودی
  if (!feedback || typeof feedback.status !== 'string' || typeof feedback.message !== 'string') {
    return res.status(400).json({ status: 'error', message: 'Invalid feedback format' });
  }
  console.log(`[Feedback Received] 🔵 ${feedback.status}: ${feedback.message}`);
  broadcast({ type: 'feedback', data: feedback });
  res.status(200).json({ status: 'success' });
});


expressApp.post('/data', (req, res) => {
  // بهبود: اعتبارسنجی ورودی
  if (!req.body || !Array.isArray(req.body.trades)) {
     return res.status(400).json({ status: 'error', message: 'Invalid trade data format' });
  }
  broadcast({ type: 'trade_data', data: req.body });
  res.status(200).json({ status: 'success' });
});

expressApp.post('/command', (req, res) => {
  const command: Command = req.body;
  if (command && command.action) {
    if (command.action === 'update_settings') {
      currentTradeRule = { ...currentTradeRule, ...command.settings };
      broadcast({ type: 'settings', data: currentTradeRule });
    } else {
      commandQueue.push(command);
      saveQueueToFile(); // --- بهبود: ذخیره صف پس از تغییر
    }
    res.status(200).json({ status: 'success' });
  } else {
    res.status(400).json({ status: 'error', message: 'Invalid command' });
  }
});

expressApp.get('/get-command', (req, res) => {
    if (commandQueue.length > 0) {
      const command = commandQueue.shift();
      saveQueueToFile(); // --- بهبود: ذخیره صف پس از تغییر
      res.status(200).json(command);
    } else {
      res.status(200).json({ status: 'no command' });
    }
});
  
expressApp.get('/get-settings', (req, res) => {
    res.status(200).json(currentTradeRule);
});

ipcMain.handle('send-command', (event, command: Command) => {
    commandQueue.push(command);
    saveQueueToFile(); // --- بهبود: ذخیره صف پس از تغییر
    return { status: 'success' };
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name: string) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.jpg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    loadQueueFromFile(); // --- بهبود: بارگذاری صف در زمان شروع
    createWindow();
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
    });
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
