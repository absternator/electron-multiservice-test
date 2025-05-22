// utils.ts

import path from "path";
import { platform } from "os";
import { app } from "electron";

export function getPlatform() {
  switch (platform()) {
    case "aix":
    case "freebsd":
    case "linux":
    case "openbsd":
    case "android":
      return "linux";
    case "darwin":
    case "sunos":
      return "mac";
    case "win32":
      return "win";
    default:
      return null;
  }
}

export function getBinariesPath() {
  const IS_PROD = process.env.NODE_ENV !== "development";
  const { isPackaged } = app;

  const binariesPath =
    IS_PROD && isPackaged
      ? path.join(process.resourcesPath, "./bin")
      : path.join(app.getAppPath(), "resources", getPlatform());

  return binariesPath;
}

// "ffmpeg" is the binary that we want to package
export const fileServicePath = path.resolve(
  path.join(getBinariesPath(), "file-service")
);

export const backendJarPath = path.resolve(
  path.join(getBinariesPath(), "fat.jar")
);

// app/bin/app
