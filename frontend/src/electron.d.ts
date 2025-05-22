// TypeScript declaration for Electron preload API
export interface ElectronAPI {
  send: (channel: string, operation: string, payload: string) => void;
  receive: (channel: string, func: (...args: unknown[]) => void) => void;
  getUserDataDir: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
