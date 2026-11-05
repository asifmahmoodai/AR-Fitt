import { AdminAuthController } from "../../adapters/express/controllers/AdminAuthController.js";
import { AdminAuthService } from "../../middleware/admin_auth/AdminAuthService.js";
import { AdminAuthMiddleware } from "../../middleware/admin_auth/AdminAuthMiddleware.js";

// Rebuilt once per request (see adapters/hono/expressCompat.js) since the Prisma
// client itself must be constructed per request on Workers.
export function buildAdminAuthController(appContext) {
  const adminAuthService = new AdminAuthService(appContext.config);
  const adminAuthMiddleware = new AdminAuthMiddleware(
    appContext.config,
    appContext.adminSessionsKV,
    appContext.prisma
  );

  return new AdminAuthController(appContext.prisma, adminAuthService, adminAuthMiddleware);
}
