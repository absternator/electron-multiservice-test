// TypeScript declaration for Electron preload API
export interface ElectronAPI {
  send: (channel: string, operation: any, payload: any) => void;
  receive: (channel: string, func: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
