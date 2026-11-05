import { SignJWT, jwtVerify } from "jose";
import { v4 } from "uuid";
import crypto from "crypto";

// Admin JWTs are intentionally isolated from the user-auth JWT system (different
// secrets, different algorithm/issuer/audience) — see the constants below.
const ADMIN_JWT_ALGORITHM = "HS512";
const ADMIN_JWT_ISSUER = "ARFitt-Admin-System";
const ADMIN_JWT_AUDIENCE = "ARFitt-Admin-Panel";
const ADMIN_ACCESS_TOKEN_EXPIRY_SECONDS = 2 * 60 * 60; // 2h
const ADMIN_REFRESH_TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7d

class AdminAuthService {
  constructor(config) {
    this.config = config;
    // Use consistent admin JWT secrets - completely separate from user auth.
    // Previously these were pre-hashed via Node's crypto.createHash (sync) before
    // being used as the raw HMAC key material. Pre-hashing a key before using it
    // as an HMAC secret adds no real security value, so on Workers (where the only
    // subtle-crypto hashing API is async) we just use the raw salted string
    // directly as the HMAC secret instead.
    this.ADMIN_ACCESS_TOKEN_SECRET = this.getAdminSecret("admin-access");
    this.ADMIN_REFRESH_TOKEN_SECRET = this.getAdminSecret("admin-refresh");
    this.ADMIN_SESSION_SECRET = this.getAdminSecret("admin-session");
  }

  getAdminSecret(type) {
    // Generate a consistent secret for admin authentication
    // Using environment variable as base, but adding admin-specific salt
    const baseSecret = this.config.SIGN_ACCESS_TOKEN_PRIVATE_KEY || "default-admin-secret";
    const adminSalt = `ADMIN_ONLY_${type}_SECRET`;
    return baseSecret + adminSalt;
  }

  async generateAdminToken(adminId, adminEmail) {
    const tokenId = v4();
    const now = Math.floor(Date.now() / 1000);
    const basePayload = {
      id: tokenId,
      adminId: adminId,
      email: adminEmail,
      isAdmin: true,
      timestamp: Date.now(),
      random: crypto.randomBytes(16).toString("hex"),
    };

    try {
      const accessSecret = new TextEncoder().encode(this.ADMIN_ACCESS_TOKEN_SECRET);
      const accessToken = await new SignJWT({ ...basePayload, type: "ADMIN_AUTH_TOKEN" })
        .setProtectedHeader({ alg: ADMIN_JWT_ALGORITHM, typ: "JWT" })
        .setIssuer(ADMIN_JWT_ISSUER)
        .setAudience(ADMIN_JWT_AUDIENCE)
        .setIssuedAt(now)
        .setExpirationTime(now + ADMIN_ACCESS_TOKEN_EXPIRY_SECONDS)
        .sign(accessSecret);

      // Generate refresh token with longer expiry
      const refreshSecret = new TextEncoder().encode(this.ADMIN_REFRESH_TOKEN_SECRET);
      const refreshToken = await new SignJWT({ ...basePayload, type: "ADMIN_REFRESH_TOKEN" })
        .setProtectedHeader({ alg: ADMIN_JWT_ALGORITHM, typ: "JWT" })
        .setIssuer(ADMIN_JWT_ISSUER)
        .setAudience(ADMIN_JWT_AUDIENCE)
        .setIssuedAt(now)
        .setExpirationTime(now + ADMIN_REFRESH_TOKEN_EXPIRY_SECONDS)
        .sign(refreshSecret);

      return {
        accessToken,
        refreshToken,
        expiresIn: ADMIN_ACCESS_TOKEN_EXPIRY_SECONDS,
        tokenType: "Bearer",
        isAdminToken: true,
      };
    } catch (error) {
      console.error("Error generating admin token:", error);
      return null;
    }
  }

  async verifyAdminAccessToken(token) {
    try {
      const secret = new TextEncoder().encode(this.ADMIN_ACCESS_TOKEN_SECRET);
      const { payload } = await jwtVerify(token, secret, {
        issuer: ADMIN_JWT_ISSUER,
        audience: ADMIN_JWT_AUDIENCE,
        algorithms: [ADMIN_JWT_ALGORITHM],
      });

      // Double-check this is an admin token
      if (payload.type !== "ADMIN_AUTH_TOKEN" || !payload.isAdmin) {
        return { valid: false, error: "Invalid admin token type" };
      }

      return {
        valid: true,
        adminId: payload.adminId,
        email: payload.email,
        tokenId: payload.id,
      };
    } catch (error) {
      console.error("Admin token verification failed:", error.message);
      return { valid: false, error: error.message };
    }
  }

  async verifyAdminRefreshToken(token) {
    try {
      const secret = new TextEncoder().encode(this.ADMIN_REFRESH_TOKEN_SECRET);
      const { payload } = await jwtVerify(token, secret, {
        issuer: ADMIN_JWT_ISSUER,
        audience: ADMIN_JWT_AUDIENCE,
        algorithms: [ADMIN_JWT_ALGORITHM],
      });

      if (payload.type !== "ADMIN_REFRESH_TOKEN" || !payload.isAdmin) {
        return { valid: false, error: "Invalid admin refresh token" };
      }

      return {
        valid: true,
        adminId: payload.adminId,
        email: payload.email,
      };
    } catch (error) {
      console.error("Admin refresh token verification failed:", error.message);
      return { valid: false, error: error.message };
    }
  }

  async refreshAdminToken(refreshToken) {
    const verification = await this.verifyAdminRefreshToken(refreshToken);

    if (!verification.valid) {
      return null;
    }

    // Generate new access token
    return this.generateAdminToken(verification.adminId, verification.email);
  }

  // Generate a secure session token for admin
  generateAdminSessionToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // Hash password specifically for admin accounts
  // NOTE: unused elsewhere in the codebase (admin login now goes through the
  // shared middleware/crypto/passwordHashing.js module, same as regular users).
  // Left in place unchanged since it isn't part of any request path.
  hashAdminPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return { salt, hash };
  }

  // Verify admin password
  verifyAdminPassword(password, salt, hash) {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return hash === verifyHash;
  }
}

export { AdminAuthService };
