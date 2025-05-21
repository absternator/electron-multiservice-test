// Electron main process entry
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools();
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile("index.html");
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// IPC handlers will be added here for communication with Kotlin backend

ipcMain.handle("file-operation", async (event, operation, payload) => {
  try {
    const response = await fetch("http://localhost:8081/file-operation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation, payload }),
    });
    if (!response.ok) {
      throw new Error(
        `Kotlin backend error: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (err) {
    return { status: "error", error: err.message, operation, payload };
  }
});
