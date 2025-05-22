// Electron preload script
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, operation, payload) => {
    if (channel === "file-operation") {
      return ipcRenderer.invoke(channel, operation, payload);
    }
    ipcRenderer.send(channel, operation, payload);
  },
  receive: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
  getUserDataDir: () => ipcRenderer.invoke("get-user-data-dir"),
});
