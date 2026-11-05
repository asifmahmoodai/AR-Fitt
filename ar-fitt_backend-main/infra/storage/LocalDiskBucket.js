import fs from "fs/promises";
import fssync from "fs";
import path from "path";

const CONTENT_TYPE_BY_EXTENSION = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

// Drop-in replacement for a Cloudflare R2 bucket binding, backed by the local
// filesystem — used when running on a plain VPS instead of Workers. Matches
// just the subset of the R2Bucket interface AdminProductController.js calls
// (put/get/delete), so that controller needed zero changes to run here.
export class LocalDiskBucket {
  constructor(directory) {
    this.directory = directory;
    if (!fssync.existsSync(directory)) {
      fssync.mkdirSync(directory, { recursive: true });
    }
  }

  async put(key, body, options = {}) {
    const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
    await fs.writeFile(path.join(this.directory, key), buffer);
    return { key, httpMetadata: options.httpMetadata };
  }

  async get(key) {
    try {
      const body = await fs.readFile(path.join(this.directory, key));
      const contentType = CONTENT_TYPE_BY_EXTENSION[path.extname(key).toLowerCase()] || "application/octet-stream";
      return { body, httpMetadata: { contentType } };
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }

  async delete(key) {
    try {
      await fs.unlink(path.join(this.directory, key));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}
