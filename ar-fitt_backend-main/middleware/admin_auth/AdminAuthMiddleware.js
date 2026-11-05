import { AdminAuthService } from "./AdminAuthService.js";
import { CommonConstants } from "../../infra/utils/common/Constants.js";

// Mirrors the previous in-memory eviction window ("Remove sessions inactive for
// more than 2 hours"). KV's native expirationTtl now enforces this directly:
// every verifyAdminToken call refreshes the TTL, so a session that goes 2 hours
// without activity simply falls out of KV on its own.
const ADMIN_SESSION_TTL_SECONDS = 2 * 60 * 60;

export class AdminAuthMiddleware {
  constructor(config, adminSessionsKV, prisma) {
    this.adminAuthService = new AdminAuthService(config);
    this.adminSessionsKV = adminSessionsKV;
    this.prisma = prisma;
  }

  // Middleware to verify admin token
  async verifyAdminToken(req, res, next) {
    try {
      // Get token from admin-specific header
      const adminToken = req.headers["x-admin-auth-token"] || req.headers["admin-authorization"];

      if (!adminToken) {
        return res.status(401).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Admin authentication required",
          isAdminAuth: true,
        });
      }

      // Remove 'Bearer ' prefix if present
      const token = adminToken.replace("Bearer ", "");

      // Verify admin token
      const verification = await this.adminAuthService.verifyAdminAccessToken(token);

      if (!verification.valid) {
        return res.status(401).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Invalid or expired admin token",
          error: verification.error,
          isAdminAuth: true,
        });
      }

      // Fetch admin user from database
      const adminUser = await this.prisma.user.findFirst({
        where: {
          id: verification.adminId,
          role: "admin",
        },
      });

      if (!adminUser) {
        return res.status(403).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Admin account not found or insufficient privileges",
          isAdminAuth: true,
        });
      }

      // Attach admin info to request
      req.admin = {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.first_name,
        lastName: adminUser.last_name,
        role: adminUser.role,
        tokenId: verification.tokenId,
      };

      // Check if this admin session is active
      const sessionKey = `${adminUser.id}_${verification.tokenId}`;
      const existingRaw = await this.adminSessionsKV.get(sessionKey);
      const nowIso = new Date().toISOString();
      const session = existingRaw
        ? { ...JSON.parse(existingRaw), lastActivity: nowIso }
        : { adminId: adminUser.id, loginTime: nowIso, lastActivity: nowIso };

      await this.adminSessionsKV.put(sessionKey, JSON.stringify(session), {
        expirationTtl: ADMIN_SESSION_TTL_SECONDS,
      });

      return next();
    } catch (error) {
      console.error("Admin authentication error:", error);
      return res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Admin authentication failed",
        isAdminAuth: true,
      });
    }
  }

  // Middleware to refresh admin token
  async refreshAdminToken(req, res, next) {
    try {
      const refreshToken = req.headers["x-admin-refresh-token"];

      if (!refreshToken) {
        return res.status(401).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Admin refresh token required",
          isAdminAuth: true,
        });
      }

      const newTokens = await this.adminAuthService.refreshAdminToken(refreshToken);

      if (!newTokens) {
        return res.status(401).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Invalid admin refresh token",
          isAdminAuth: true,
        });
      }

      req.newAdminTokens = newTokens;
      return next();
    } catch (error) {
      console.error("Admin token refresh error:", error);
      return res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Admin token refresh failed",
        isAdminAuth: true,
      });
    }
  }

  // Clear admin session
  async clearAdminSession(adminId, tokenId) {
    const sessionKey = `${adminId}_${tokenId}`;
    await this.adminSessionsKV.delete(sessionKey);
  }

  // Clear all sessions for an admin
  async clearAllAdminSessions(adminId) {
    const prefix = `${adminId}_`;
    let cursor;
    do {
      const page = await this.adminSessionsKV.list(cursor ? { prefix, cursor } : { prefix });
      await Promise.all(page.keys.map((key) => this.adminSessionsKV.delete(key.name)));
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
  }

  // Get active admin sessions
  async getActiveAdminSessions() {
    const sessions = [];
    const now = new Date();
    let cursor;
    do {
      const page = await this.adminSessionsKV.list(cursor ? { cursor } : {});
      for (const key of page.keys) {
        const raw = await this.adminSessionsKV.get(key.name);
        if (!raw) continue;
        const session = JSON.parse(raw);
        const inactiveMinutes = Math.floor((now - new Date(session.lastActivity)) / 1000 / 60);
        sessions.push({
          sessionKey: key.name,
          ...session,
          inactiveMinutes,
        });
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);

    return sessions;
  }
}
