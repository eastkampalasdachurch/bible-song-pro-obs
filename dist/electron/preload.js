"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const electron_1 = require("electron");
const BSPDesktop = {
    async getDisplays() {
        return electron_1.ipcRenderer.invoke('bsp:get-displays');
    },
    async openOutput(options = {}) {
        return electron_1.ipcRenderer.invoke('bsp:open-output', options);
    },
    async closeOutput() {
        return electron_1.ipcRenderer.invoke('bsp:close-output');
    },
    async isOutputOpen() {
        return electron_1.ipcRenderer.invoke('bsp:is-output-open');
    },
    async sendOutputMessage(message) {
        return electron_1.ipcRenderer.invoke('bsp:send-output-message', message);
    },
    async sendVmixOutputMessage(message) {
        return electron_1.ipcRenderer.invoke('bsp:send-vmix-output-message', message);
    },
    async requestOutputFullscreen() {
        return electron_1.ipcRenderer.invoke('bsp:request-output-fullscreen');
    },
    async getLocalServerInfo() {
        return electron_1.ipcRenderer.invoke('bsp:get-local-server-info');
    },
    async copyText(text) {
        return electron_1.ipcRenderer.invoke('bsp:copy-text', text);
    },
    async getSystemStats() {
        return electron_1.ipcRenderer.invoke('bsp:get-system-stats');
    },
    async saveTheme(theme) {
        return electron_1.ipcRenderer.invoke('bsp:save-theme', theme);
    },
    async openRecordingInLocation(payload = {}) {
        return electron_1.ipcRenderer.invoke('bsp:open-in-location', payload.path);
    },
    onOutputClosed(callback) {
        electron_1.ipcRenderer.removeAllListeners('bsp:output-closed');
        electron_1.ipcRenderer.on('bsp:output-closed', () => callback());
    }
};
electron_1.contextBridge.exposeInMainWorld('BSPDesktop', BSPDesktop);
window.addEventListener('DOMContentLoaded', () => {
    electron_1.ipcRenderer.send('bsp:register-output-closed-listener');
});
electron_1.ipcRenderer.on('bsp:output-message', (_event, message) => {
    window.postMessage(message, '*');
});
