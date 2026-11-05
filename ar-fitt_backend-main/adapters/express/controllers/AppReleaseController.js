import { bodyLimit } from "hono/body-limit";
import { mountExpressController } from "../../hono/expressCompat.js";
import { ApkReleaseError, MAX_APK_SIZE } from "../../../infra/storage/LocalApkReleaseStore.js";

const publicRelease = (release) => release && ({
  ...release,
  downloadPath: `/downloads/ARFitt.apk?release=${release.id}`,
});

export class AppReleaseController {
  constructor(store, adminAuthMiddleware) {
    this.store = store;
    this.adminAuthMiddleware = adminAuthMiddleware;
  }

  async getRelease(req, res) {
    try {
      res.set("Cache-Control", "no-store");
      return res.json({ status: "success", data: publicRelease(await this.store.getRelease()) });
    } catch (error) { return this.handleError(error, res); }
  }

  async upload(req, res) {
    if (!req.headers["content-type"]?.includes("multipart/form-data")) {
      return res.status(400).json({ status: "failure", message: "Upload the APK using the upload form." });
    }
    let form;
    try { form = await req.raw.formData(); }
    catch { return res.status(400).json({ status: "failure", message: "The upload was incomplete. Please try again." }); }
    try {
      const release = await this.store.publish(form.get("apk"), form.get("version"));
      res.set("Cache-Control", "no-store");
      return res.status(201).json({ status: "success", message: "APK uploaded. It is now available on the website.", data: publicRelease(release) });
    } catch (error) { return this.handleError(error, res); }
  }

  handleError(error, res) {
    if (error instanceof ApkReleaseError) return res.status(error.status).json({ status: "failure", message: error.message });
    console.error("App release request failed:", error);
    return res.status(500).json({ status: "failure", message: "Unable to save or load the Android app. Please try again." });
  }

  static registerRoutes(app, buildController) {
    app.use("/admin/app-release", bodyLimit({
      maxSize: MAX_APK_SIZE + 1024 * 1024,
      onError: (c) => c.json({ status: "failure", message: "The APK must be 200 MB or smaller." }, 413),
    }));
    const router = mountExpressController(app, buildController);
    const auth = (controller, req, res, next) => controller.adminAuthMiddleware.verifyAdminToken(req, res, next);
    router.get("/admin/app-release", auth, (controller, req, res) => controller.getRelease(req, res));
    router.post("/admin/app-release", { skipBodyParse: true }, auth, (controller, req, res) => controller.upload(req, res));
    router.get("/app-release", (controller, req, res) => controller.getRelease(req, res));
    app.on(["GET", "HEAD"], "/downloads/ARFitt.apk", async (c) => {
      try {
        return await buildController(c.get("appContext")).store.download(c.req.query("release"), c.req.header("Range"), c.req.method, c.req.header("If-Range"));
      } catch (error) {
        if (error instanceof ApkReleaseError) return c.json({ status: "failure", message: error.message }, error.status);
        console.error("APK download failed:", error);
        return c.json({ status: "failure", message: "Unable to download the app. Please try again." }, 500);
      }
    });
  }
}
