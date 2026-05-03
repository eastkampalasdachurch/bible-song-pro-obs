// @ts-nocheck
import { contextBridge, ipcRenderer } from 'electron';

declare const window: Window;

interface DisplayInfo {
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

interface BSPDesktop {
  getDisplays(): Promise<DisplayInfo[]>;
  openOutput(options?: object): Promise<{ ok: boolean }>;
  closeOutput(): Promise<{ ok: boolean }>;
  isOutputOpen(): Promise<boolean>;
  sendOutputMessage(message: unknown): Promise<{ ok: boolean }>;
  sendVmixOutputMessage(message: unknown): Promise<{ ok: boolean }>;
  requestOutputFullscreen(): Promise<{ ok: boolean }>;
  getLocalServerInfo(): Promise<ServerInfo>;
  copyText(text: string): Promise<{ ok: boolean }>;
  getSystemStats(): Promise<SystemStats>;
  saveTheme(theme: object): Promise<{ ok: boolean }>;
  openRecordingInLocation(payload: { path?: string }): Promise<{ ok: boolean }>;
  onOutputClosed(callback: () => void): void;
}

const BSPDesktop: BSPDesktop = {
  async getDisplays() {
    return ipcRenderer.invoke('bsp:get-displays');
  },
  async openOutput(options = {}) {
    return ipcRenderer.invoke('bsp:open-output', options);
  },
  async closeOutput() {
    return ipcRenderer.invoke('bsp:close-output');
  },
  async isOutputOpen() {
    return ipcRenderer.invoke('bsp:is-output-open');
  },
  async sendOutputMessage(message) {
    return ipcRenderer.invoke('bsp:send-output-message', message);
  },
  async sendVmixOutputMessage(message) {
    return ipcRenderer.invoke('bsp:send-vmix-output-message', message);
  },
  async requestOutputFullscreen() {
    return ipcRenderer.invoke('bsp:request-output-fullscreen');
  },
  async getLocalServerInfo() {
    return ipcRenderer.invoke('bsp:get-local-server-info');
  },
  async copyText(text) {
    return ipcRenderer.invoke('bsp:copy-text', text);
  },
  async getSystemStats() {
    return ipcRenderer.invoke('bsp:get-system-stats');
  },
  async saveTheme(theme) {
    return ipcRenderer.invoke('bsp:save-theme', theme);
  },
  async openRecordingInLocation(payload = {}) {
    return ipcRenderer.invoke('bsp:open-in-location', payload.path);
  },
  onOutputClosed(callback) {
    ipcRenderer.removeAllListeners('bsp:output-closed');
    ipcRenderer.on('bsp:output-closed', () => callback());
  }
};

contextBridge.exposeInMainWorld('BSPDesktop', BSPDesktop);

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('bsp:register-output-closed-listener');
});

ipcRenderer.on('bsp:output-message', (_event: IpcRendererEvent, message: unknown) => {
  window.postMessage(message, '*');
});