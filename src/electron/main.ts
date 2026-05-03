// @ts-nocheck
import { app, BrowserWindow, ipcMain, screen, shell, clipboard } from 'electron';
import * as http from 'http';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { WebSocketServer, WebSocket } from 'ws';
  id: number;
  label: string;
  width: number;
  height: number;
  x: number;
  y: number;
  isPrimary: boolean;
  isInternal: boolean;
}

interface ServerInfo {
  httpPort: number;
  relayPort: number;
  preferredHost: string;
  availableHosts: string[];
  displayPath: string;
  displayUrl: string;
  relayUrl: string;
}

interface SystemStats {
  platform: string;
  arch: string;
  electronVersion: string;
  memory: {
    total: number;
    free: number;
    percent: number;
  };
  cpu: {
    percent: number;
  };
  gpu: {
    renderer: string;
    vram: string;
  };
}

let mainWindow: BrowserWindow | null = null;
let outputWindow: BrowserWindow | null = null;
const outputClosedCallbacks = new Set<number>();
let httpServer: http.Server | null = null;
let relayServer: WebSocketServer | null = null;
const relayClients = new Set<WebSocket>();
const LOCAL_HTTP_PORT = 5510;
const LOCAL_RELAY_PORT = 5511;

function resolveAppFile(name: string): string {
  return path.join(__dirname, '..', '..', name);
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.ts') return 'application/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.json') return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

function getLanAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const out: string[] = [];
  Object.values(interfaces).forEach((entries) => {
    (entries || []).forEach((entry) => {
      if (!entry || entry.internal) return;
      if (entry.family !== 'IPv4') return;
      out.push(entry.address);
    });
  });
  return [...new Set(out)];
}

function getLocalServerInfo(): ServerInfo {
  const addresses = getLanAddresses();
  const preferredHost = addresses[0] || '127.0.0.1';
  return {
    httpPort: LOCAL_HTTP_PORT,
    relayPort: LOCAL_RELAY_PORT,
    preferredHost,
    availableHosts: ['127.0.0.1', ...addresses],
    displayPath: '/BSP_display.html',
    displayUrl: `http://${preferredHost}:${LOCAL_HTTP_PORT}/BSP_display.html?hostMode=vmix&relay=ws://${preferredHost}:${LOCAL_RELAY_PORT}`,
    relayUrl: `ws://${preferredHost}:${LOCAL_RELAY_PORT}`
  };
}

function startHttpServer(): void {
  if (httpServer) return;
  httpServer = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`);
    const pathname = decodeURIComponent(url.pathname === '/' ? '/BSP_display.html' : url.pathname);
    const target = resolveAppFile(pathname.replace(/^\/+/, ''));
    if (!target.startsWith(path.join(__dirname, '..'))) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(target, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': getContentType(target) });
      res.end(data);
    });
  });
  httpServer.listen(LOCAL_HTTP_PORT, '0.0.0.0');
}

function startRelayServer(): void {
  if (relayServer) return;
  relayServer = new WebSocketServer({ host: '0.0.0.0', port: LOCAL_RELAY_PORT });
  relayServer.on('connection', (socket) => {
    relayClients.add(socket);
    socket.on('close', () => relayClients.delete(socket));
    socket.on('message', (payload) => {
      relayClients.forEach((client) => {
        if (client === socket || client.readyState !== 1) return;
        client.send(payload.toString());
      });
    });
  });
}

function broadcastRelayMessage(message: unknown): void {
  const data = typeof message === 'string' ? message : JSON.stringify(message);
  relayClients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 980,
    minWidth: 560,
    minHeight: 760,
    backgroundColor: '#101318',
    title: 'SDA Bible Song Pro',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadURL('http://localhost:3000/panel');
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (outputWindow && !outputWindow.isDestroyed()) {
      outputWindow.close();
    }
  });
}

function getDisplayBounds(displayId?: number): Electron.Rectangle {
  const displays = screen.getAllDisplays();
  if (displayId) {
    const match = displays.find((entry) => entry.id === displayId);
    if (match) return match.bounds;
  }
  const external = displays.find((entry) => !entry.internal) || screen.getPrimaryDisplay();
  return external.bounds;
}

interface OutputOptions {
  displayId?: number;
  fullscreen?: boolean;
}

function createOutputWindow(options: OutputOptions = {}): BrowserWindow {
  const bounds = getDisplayBounds(options.displayId);
  if (outputWindow && !outputWindow.isDestroyed()) {
    outputWindow.setBounds(bounds);
    outputWindow.focus();
    return outputWindow;
  }

  outputWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    frame: false,
    show: true,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    fullscreen: !!options.fullscreen,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  outputWindow.loadFile(resolveAppFile('BSP_display.html'), {
    query: {
      standalone: '1',
      hostMode: 'standalone'
    }
  });

  outputWindow.on('closed', () => {
    outputWindow = null;
    outputClosedCallbacks.forEach((webContentsId) => {
      const windows = BrowserWindow.getAllWindows();
      const matchingWindow = windows.find((win) => win.webContents && win.webContents.id === webContentsId);
      if (matchingWindow && matchingWindow.webContents) {
        matchingWindow.webContents.send('bsp:output-closed');
      }
    });
  });

  return outputWindow;
}

function getSystemStats(): SystemStats {
  return {
    platform: process.platform,
    arch: process.arch,
    electronVersion: process.versions.electron,
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      percent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
    },
    cpu: {
      percent: 0
    },
    gpu: {
      renderer: 'Electron',
      vram: ''
    }
  };
}

app.whenReady().then(() => {
  ipcMain.handle('bsp:get-displays', (): DisplayInfo[] => {
    return screen.getAllDisplays().map((display) => ({
      id: display.id,
      label: display.label || `Display ${display.id}`,
      width: display.bounds.width,
      height: display.bounds.height,
      x: display.bounds.x,
      y: display.bounds.y,
      isPrimary: display.id === screen.getPrimaryDisplay().id,
      isInternal: !!display.internal
    }));
  });

  ipcMain.handle('bsp:open-output', (_event: IpcMainInvokeEvent, options: OutputOptions = {}): { ok: boolean } => {
    createOutputWindow(options);
    return { ok: true };
  });

  ipcMain.handle('bsp:close-output', (): { ok: boolean } => {
    if (outputWindow && !outputWindow.isDestroyed()) {
      outputWindow.close();
    }
    return { ok: true };
  });

  ipcMain.handle('bsp:is-output-open', (): boolean => {
    return !!(outputWindow && !outputWindow.isDestroyed());
  });

  ipcMain.handle('bsp:send-output-message', (_event: IpcMainInvokeEvent, message: unknown): { ok: boolean } => {
    if (!outputWindow || outputWindow.isDestroyed()) return { ok: false };
    outputWindow.webContents.send('bsp:output-message', message);
    return { ok: true };
  });

  ipcMain.handle('bsp:send-vmix-output-message', (_event: IpcMainInvokeEvent, message: unknown): { ok: boolean } => {
    broadcastRelayMessage(message);
    return { ok: true };
  });

  ipcMain.handle('bsp:get-local-server-info', (): ServerInfo => {
    return getLocalServerInfo();
  });

  ipcMain.handle('bsp:copy-text', (_event: IpcMainInvokeEvent, text: string): { ok: boolean } => {
    clipboard.writeText(String(text || ''));
    return { ok: true };
  });

  ipcMain.handle('bsp:request-output-fullscreen', (): { ok: boolean } => {
    if (outputWindow && !outputWindow.isDestroyed()) {
      outputWindow.setFullScreen(true);
    }
    return { ok: true };
  });

  ipcMain.handle('bsp:get-system-stats', (): SystemStats => {
    return getSystemStats();
  });

  ipcMain.handle('bsp:save-theme', (): { ok: boolean } => {
    return { ok: true };
  });

  ipcMain.handle('bsp:open-in-location', async (_event: IpcMainInvokeEvent, targetPath?: string): Promise<{ ok: boolean }> => {
    if (targetPath) await shell.showItemInFolder(targetPath);
    return { ok: true };
  });

  ipcMain.on('bsp:register-output-closed-listener', (event: Electron.IpcMainEvent) => {
    outputClosedCallbacks.add(event.sender.id);
  });

  startHttpServer();
  startRelayServer();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (httpServer) {
    try { httpServer.close(); } catch (e) { /* empty */ }
  }
  if (relayServer) {
    try { relayServer.close(); } catch (e) { /* empty */ }
  }
  
  // Kill Next.js dev server
  if (process.platform === 'win32') {
    spawn('taskkill', ['/F', '/PID', process.pid.toString()], { shell: true, detached: true });
    spawn('cmd', ['/c', 'taskkill', '/F', '/IM', 'node.exe'], { shell: true, detached: true });
  } else {
    process.kill(-process.pid);
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});