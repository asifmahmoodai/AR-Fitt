import { AdminUserController } from "../../adapters/express/controllers/AdminUserController.js";
import { AdminAuthMiddleware } from "../../middleware/admin_auth/AdminAuthMiddleware.js";

// Rebuilt once per request (see adapters/hono/expressCompat.js) since the Prisma
// client itself must be constructed per request on Workers.
export function buildAdminUserController(appContext) {
  const adminAuthMiddleware = new AdminAuthMiddleware(
    appContext.config,
    appContext.adminSessionsKV,
    appContext.prisma
  );

  return new AdminUserController(appContext.prisma, adminAuthMiddleware);
}
