import axios from "axios";
import { baseUrl } from "../utils/constants/URLS";

export interface AppRelease {
  id: string;
  version: string;
  fileName: string;
  size: number;
  uploadedAt: string;
  downloadPath: string;
}

export async function getPublicAppRelease(): Promise<AppRelease | null> {
  const response = await axios.get(`${baseUrl || ""}/app-release`);
  return response.data.data;
}

export const getApkDownloadUrl = (release: AppRelease) => `${baseUrl || ""}${release.downloadPath}`;
export const formatApkSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
