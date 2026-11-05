import { createReadStream, createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import yauzl from "yauzl";

export const MAX_APK_SIZE = 200 * 1024 * 1024;
const RELEASE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export class ApkReleaseError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function validateApk(filePath) {
  return new Promise((resolve, reject) => {
    yauzl.open(filePath, { lazyEntries: true }, (error, zip) => {
      if (error) return reject(new ApkReleaseError(400, "Please upload a valid Android APK file."));
      let hasManifest = false;
      zip.on("error", () => {
        zip.close();
        reject(new ApkReleaseError(400, "Please upload a valid Android APK file."));
      });
      zip.on("entry", (entry) => {
        if (entry.fileName === "AndroidManifest.xml" && entry.uncompressedSize > 0) hasManifest = true;
        zip.readEntry();
      });
      zip.on("end", () => {
        if (hasManifest) resolve();
        else reject(new ApkReleaseError(400, "This archive is not an Android APK file."));
      });
      zip.readEntry();
    });
  });
}

export class LocalApkReleaseStore {
  constructor(directory) {
    this.directory = path.resolve(directory);
    this.manifestPath = path.join(this.directory, "current-release.json");
  }

  async getRelease() {
    try {
      const release = JSON.parse(await fs.readFile(this.manifestPath, "utf8"));
      if (!RELEASE_ID.test(release.id)) throw new Error("Invalid APK release metadata");
      await fs.access(path.join(this.directory, `${release.id}.apk`));
      return release;
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }

  async publish(file, version) {
    if (!file || typeof file.stream !== "function" || !/\.apk$/i.test(file.name || "")) {
      throw new ApkReleaseError(400, "Choose an .apk file to upload.");
    }
    if (file.size === 0) throw new ApkReleaseError(400, "The APK file is empty.");
    if (file.size > MAX_APK_SIZE) throw new ApkReleaseError(413, "The APK must be 200 MB or smaller.");
    const cleanVersion = typeof version === "string" ? version.trim() : "";
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._+ -]{0,39}$/.test(cleanVersion)) {
      throw new ApkReleaseError(400, "Enter an app version, such as 1.0.0 (maximum 40 characters).");
    }

    await fs.mkdir(this.directory, { recursive: true });
    const id = randomUUID();
    const temporaryPath = path.join(this.directory, `${id}.upload`);
    const apkPath = path.join(this.directory, `${id}.apk`);
    const manifestTempPath = path.join(this.directory, `${id}.json.tmp`);
    try {
      await pipeline(Readable.fromWeb(file.stream()), createWriteStream(temporaryPath, { flags: "wx", mode: 0o600 }));
      await validateApk(temporaryPath);
      const release = {
        id,
        version: cleanVersion,
        fileName: file.name.split(/[\\/]/).pop().slice(0,255),
        size: (await fs.stat(temporaryPath)).size,
        uploadedAt: new Date().toISOString(),
      };
      await fs.rename(temporaryPath, apkPath);
      await fs.writeFile(manifestTempPath, JSON.stringify(release), { mode: 0o600 });
      // Publish only once the complete APK is ready. Older files remain available
      // through their release IDs so an update cannot interrupt a mobile download.
      await fs.rename(manifestTempPath, this.manifestPath);
      return release;
    } catch (error) {
      await Promise.all([temporaryPath, apkPath, manifestTempPath].map((filePath) => fs.rm(filePath, { force: true })));
      throw error;
    }
  }

  async download(releaseId, range, method = "GET", ifRange) {
    const id = releaseId || (await this.getRelease())?.id;
    if (!id || !RELEASE_ID.test(id)) throw new ApkReleaseError(404, "The Android app is not available yet.");
    const filePath = path.join(this.directory, `${id}.apk`);
    let stat;
    try { stat = await fs.stat(filePath); }
    catch (error) {
      if (error.code === "ENOENT") throw new ApkReleaseError(404, "The Android app is not available yet.");
      throw error;
    }
    const headers = {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": 'attachment; filename="ARFitt.apk"',
      "X-Content-Type-Options": "nosniff",
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store",
      "ETag": `"${id}"`,
    };
    let start = 0;
    let end = stat.size - 1;
    let status = 200;
    if (range && (!ifRange || ifRange === headers.ETag)) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) {
        return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${stat.size}` } });
      }
      if (match[1]) {
        start = Number(match[1]);
        if (match[2]) end = Math.min(Number(match[2]), end);
      } else {
        start = Math.max(0, stat.size - Number(match[2]));
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) {
        return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${stat.size}` } });
      }
      status = 206;
      headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
    }
    headers["Content-Length"] = String(end - start + 1);
    const body = method === "HEAD" ? null : Readable.toWeb(createReadStream(filePath, { start, end }));
    return new Response(body, { status, headers });
  }
}
