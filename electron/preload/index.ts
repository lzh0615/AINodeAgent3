import { contextBridge } from 'electron'

// Expose a simple API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
})

// Type declarations for the exposed API
declare global {
  interface Window {
    electronAPI: {
      platform: string
      versions: NodeJS.ProcessVersions
    }
  }
}