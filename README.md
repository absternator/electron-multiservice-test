# Electron Vibe

A cross-platform, offline-first file management application built with Electron, React (Vite), Kotlin (Ktor), and Rust (Axum).

## Features
- Modern, responsive UI for file/folder navigation and preview
- Real-time file/folder tree visualization
- File operations: create, read, update, delete, move, copy, rename, list
- Operation status feedback and error handling
- Strictly offline, zero telemetry
- Cross-platform: Windows, macOS, Linux

## Architecture
- **Frontend:** React + Vite (in Electron)
- **Electron Main:** Handles IPC and launches the UI
- **Backend:** Kotlin (Ktor) server for IPC and routing
- **File Service:** Rust (Axum) microservice for all file operations

## Prerequisites
- Node.js (v18+ recommended)
- Rust toolchain (`cargo`)
- Java 17+ (for Kotlin backend)
- Kotlin/Gradle (wrapper included)

## Getting Started

### 1. Start the Rust File Service
```
cd file-service
cargo run
```
This starts the file operations API at `http://localhost:8082`.

### 2. Start the Kotlin Backend
```
cd backend
./gradlew :app:run
```
This starts the Ktor server at `http://localhost:8081`.

### 3. Start the Frontend (Electron + Vite)
Open a new terminal:
```
cd frontend
npm install
npm run electron:dev
```
This opens the Electron app in development mode, loading the Vite dev server.

### 4. Build for Production
#### Build the Frontend
```
cd frontend
npm run build
```
#### Build All Services and Electron App (all platforms)
```
./build.sh
```
This script builds the Rust file service, Kotlin backend, and frontend, and copies the binaries to the correct platform-specific resources directory.

#### Package the Electron App (per platform)
- **Linux:**
  ```
  cd frontend
  npm run electron:build:linux
  ```
  The output will be `dist_electron/multivibe.AppImage`.
- **Windows:**
  ```
  cd frontend
  npm run electron:build:win
  ```
  The output will be `dist_electron/multivibe.exe`.
- **macOS:**
  ```
  cd frontend
  npm run electron:build:mac
  ```
  The output will be `dist_electron/multivibe.dmg`.

### Automated GitHub Release
On every push of a tag like `v1.0.0`, GitHub Actions will:
- Build and package the app for Linux, Windows, and macOS
- Attach the distributables to a GitHub Release automatically

## Platform Notes
- **Windows:** Use PowerShell or Git Bash for shell commands. Electron builder will create an `.exe` installer.
- **macOS:** Electron builder will create a `.dmg` installer.
- **Linux:** Electron builder will create an AppImage.

## Troubleshooting
- Ensure all three services (Rust, Kotlin, Electron) are running for full functionality.
- If the Electron app is blank in dev mode, make sure the Vite dev server is running (`npm run dev`).
- For file permission issues, run the Electron app with appropriate permissions.

## Project Structure
```
backend/      # Kotlin Ktor backend
file-service/ # Rust Axum file operations microservice
frontend/     # React + Vite + Electron frontend
```

## License
MIT
