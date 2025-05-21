Create a cross-platform Electron file management application with the following specifications:

## Core Requirements

- Development in current directory
- Strictly offline operation - no internet connectivity
- Focus on local filesystem operations (CRUD, move, copy, rename)
- Cross-platform support: Windows, macOS, Linux
- Zero telemetry or analytics

## Technical Architecture

### Frontend (React + Vite)

```typescript
// Key Features
- Modern, responsive UI with intuitive file/folder navigation
- Real-time file/folder tree visualization
- File preview capabilities
- Operation status feedback
- Error handling and user notifications
- IPC communication with Kotlin backend
```

### Backend (Kotlin)

```kotlin
// Responsibilities
- IPC handler for frontend requests
- Request routing to Rust microservice
- Response aggregation and error handling
- State management and caching
```

### File Operations Service (Rust)

```rust
// API Endpoints
POST /file/create
GET /file/read
PUT /file/update
DELETE /file/delete
POST /file/move
POST /file/copy
PUT /file/rename
GET /folder/list
```

## Implementation Requirements

1. Bundle all dependencies within the application
2. Provide detailed error messages and stack traces
3. Maintain consistent behavior across platforms

## Development Guidelines

1. Follow platform-specific filesystem conventions
2. Implement proper error boundaries
3. Use async operations for large files
4. Validate all file operations before execution

Reference: Electron File Operations API (https://www.electronjs.org/docs/latest/api/file-system)
