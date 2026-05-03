"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const electron_1 = require("electron");
const http = __importStar(require("http"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const ws_1 = require("ws");
let mainWindow = null;
let outputWindow = null;
const outputClosedCallbacks = new Set();
let httpServer = null;
let relayServer = null;
const relayClients = new Set();
const LOCAL_HTTP_PORT = 5510;
const LOCAL_RELAY_PORT = 5511;
function resolveAppFile(name) {
    return path.join(__dirname, '..', '..', name);
}
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.html')
        return 'text/html; charset=utf-8';
    if (ext === '.js')
        return 'application/javascript; charset=utf-8';
    if (ext === '.ts')
        return 'application/javascript; charset=utf-8';
    if (ext === '.css')
        return 'text/css; charset=utf-8';
    if (ext === '.svg')
        return 'image/svg+xml';
    if (ext === '.png')
        return 'image/png';
    if (ext === '.jpg' || ext === '.jpeg')
        return 'image/jpeg';
    if (ext === '.json')
        return 'application/json; charset=utf-8';
    return 'application/octet-stream';
}
function getLanAddresses() {
    const interfaces = os.networkInterfaces();
    const out = [];
    Object.values(interfaces).forEach((entries) => {
        (entries || []).forEach((entry) => {
            if (!entry || entry.internal)
                return;
            if (entry.family !== 'IPv4')
                return;
            out.push(entry.address);
        });
    });
    return [...new Set(out)];
}
function getLocalServerInfo() {
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
function startHttpServer() {
    if (httpServer)
        return;
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
function startRelayServer() {
    if (relayServer)
        return;
    relayServer = new ws_1.WebSocketServer({ host: '0.0.0.0', port: LOCAL_RELAY_PORT });
    relayServer.on('connection', (socket) => {
        relayClients.add(socket);
        socket.on('close', () => relayClients.delete(socket));
        socket.on('message', (payload) => {
            relayClients.forEach((client) => {
                if (client === socket || client.readyState !== 1)
                    return;
                client.send(payload.toString());
            });
        });
    });
}
function broadcastRelayMessage(message) {
    const data = typeof message === 'string' ? message : JSON.stringify(message);
    relayClients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(data);
        }
    });
}
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
function getDisplayBounds(displayId) {
    const displays = electron_1.screen.getAllDisplays();
    if (displayId) {
        const match = displays.find((entry) => entry.id === displayId);
        if (match)
            return match.bounds;
    }
    const external = displays.find((entry) => !entry.internal) || electron_1.screen.getPrimaryDisplay();
    return external.bounds;
}
function createOutputWindow(options = {}) {
    const bounds = getDisplayBounds(options.displayId);
    if (outputWindow && !outputWindow.isDestroyed()) {
        outputWindow.setBounds(bounds);
        outputWindow.focus();
        return outputWindow;
    }
    outputWindow = new electron_1.BrowserWindow({
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
            const windows = electron_1.BrowserWindow.getAllWindows();
            const matchingWindow = windows.find((win) => win.webContents && win.webContents.id === webContentsId);
            if (matchingWindow && matchingWindow.webContents) {
                matchingWindow.webContents.send('bsp:output-closed');
            }
        });
    });
    return outputWindow;
}
function getSystemStats() {
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
electron_1.app.whenReady().then(() => {
    electron_1.ipcMain.handle('bsp:get-displays', () => {
        return electron_1.screen.getAllDisplays().map((display) => ({
            id: display.id,
            label: display.label || `Display ${display.id}`,
            width: display.bounds.width,
            height: display.bounds.height,
            x: display.bounds.x,
            y: display.bounds.y,
            isPrimary: display.id === electron_1.screen.getPrimaryDisplay().id,
            isInternal: !!display.internal
        }));
    });
    electron_1.ipcMain.handle('bsp:open-output', (_event, options = {}) => {
        createOutputWindow(options);
        return { ok: true };
    });
    electron_1.ipcMain.handle('bsp:close-output', () => {
        if (outputWindow && !outputWindow.isDestroyed()) {
            outputWindow.close();
        }
        return { ok: true };
    });
    electron_1.ipcMain.handle('bsp:is-output-open', () => {
        return !!(outputWindow && !outputWindow.isDestroyed());
    });
    electron_1.ipcMain.handle('bsp:send-output-message', (_event, message) => {
        if (!outputWindow || outputWindow.isDestroyed())
            return { ok: false };
        outputWindow.webContents.send('bsp:output-message', message);
        return { ok: true };
    });
    electron_1.ipcMain.handle('bsp:send-vmix-output-message', (_event, message) => {
        broadcastRelayMessage(message);
        return { ok: true };
    });
    electron_1.ipcMain.handle('bsp:get-local-server-info', () => {
        return getLocalServerInfo();
    });
    electron_1.ipcMain.handle('bsp:copy-text', (_event, text) => {
        electron_1.clipboard.writeText(String(text || ''));
        return { ok: true };
    });
    electron_1.ipcMain.handle('bsp:request-output-fullscreen', () => {
        if (outputWindow && !outputWindow.isDestroyed()) {
            outputWindow.setFullScreen(true);
        }
        return { ok: true };
    });
    electron_1.ipcMain.handle('bsp:get-system-stats', () => {
        return getSystemStats();
    });
    electron_1.ipcMain.handle('bsp:save-theme', () => {
        return { ok: true };
    });
    electron_1.ipcMain.handle('bsp:open-in-location', async (_event, targetPath) => {
        if (targetPath)
            await electron_1.shell.showItemInFolder(targetPath);
        return { ok: true };
    });
    electron_1.ipcMain.on('bsp:register-output-closed-listener', (event) => {
        outputClosedCallbacks.add(event.sender.id);
    });
    startHttpServer();
    startRelayServer();
    createMainWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createMainWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (httpServer) {
        try {
            httpServer.close();
        }
        catch (e) { /* empty */ }
    }
    if (relayServer) {
        try {
            relayServer.close();
        }
        catch (e) { /* empty */ }
    }
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
