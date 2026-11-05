import path from "node:path";
import { AppReleaseController } from "../../adapters/express/controllers/AppReleaseController.js";
import { LocalApkReleaseStore } from "../../infra/storage/LocalApkReleaseStore.js";
import { AdminAuthMiddleware } from "../../middleware/admin_auth/AdminAuthMiddleware.js";

const store = new LocalApkReleaseStore(process.env.APK_RELEASES_DIR || path.resolve("app_releases"));

export function buildAppReleaseController(appContext) {
  return new AppReleaseController(store, new AdminAuthMiddleware(appContext.config, appContext.adminSessionsKV, appContext.prisma));
}
