// Electron main process entry
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { spawn } from "child_process";
import { fileServicePath, backendJarPath } from "./resource-utils.js"; // Import the file service path
let backendProcess, fileServiceProcess;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startServices() {
  // Start backend (Kotlin)
  backendProcess = spawn("java", ["-jar", backendJarPath], {
    cwd: path.dirname(backendJarPath),
    stdio: "inherit",
  });
  backendProcess.on("error", (err) => {
    console.error("Failed to start backend:", err);
  });

  //  Start file service (Rust)
  fileServiceProcess = spawn(fileServicePath, [], {
    cwd: path.dirname(fileServicePath),
    stdio: "inherit",
  });
  fileServiceProcess.on("error", (err) => {
    console.error("Failed to start file service:", err);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: "#f5f7fa", // Soft light background
    title: "Electron Packit App",
    icon: path.join(__dirname, "src/assets/icon.png"), // Use PNG for Ubuntu dock icon
    roundedCorners: true,
    vibrancy: "light", // For a modern look (on supported platforms)
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
    console.log(path.join(__dirname, "dist", "index.html"));
    // In production, load the built index.html from the dist directory
    win.loadFile(path.join(app.getAppPath(), "dist", "index.html"));
  }
}

app.whenReady().then(() => {
  if (process.env.NODE_ENV !== "development") {
    startServices();
  }
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  if (fileServiceProcess) fileServiceProcess.kill();
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
