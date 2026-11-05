import { SignJWT, jwtVerify } from "jose";
import { v4 } from "uuid";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

function expirySecondsFor(userType) {
  switch (userType) {
    case CommonConstants.GUEST_USER_TYPE:
      return 86400; // 60 * 60 * 24
    case CommonConstants.REGISTERED_USER_TYPE:
      return 3600; // 60 * 60
    default:
      return 3600;
  }
}

async function signToken(payload, secretString, issuer, audience, subject, notBefore, issuedAt, expiry) {
  const secret = new TextEncoder().encode(secretString);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: CommonConstants.JWT_TOKEN_ALGORITHM, typ: CommonConstants.JWT_TOKEN_TYPE })
    .setJti(v4())
    .setIssuer(issuer)
    .setSubject(subject)
    .setAudience(audience)
    .setNotBefore(notBefore)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiry)
    .sign(secret);
}

export class AuthService {
  constructor(config) {
    this.config = config;
  }

  async generateToken(userID, clientType, userType) {
    const issuer = this.config.SERVER_HOST_URL;
    const audience = this.config.ALLOWED_ORIGIN_URL;
    const now = Math.floor(Date.now() / 1000);
    const notBefore = now - CommonConstants.NOT_BEFORE_BUFFER_TIME;

    let accessToken;
    try {
      accessToken = await signToken(
        { userType },
        this.config.SIGN_ACCESS_TOKEN_PRIVATE_KEY,
        issuer,
        audience,
        userID,
        notBefore,
        now,
        now + expirySecondsFor(userType)
      );
    } catch (error) {
      console.log("unable to generate token, error: ", error);
      return null;
    }

    if (clientType == null || clientType == CommonConstants.CLIENT_TYPE_WEB) {
      return accessToken;
    }

    let refreshToken;
    try {
      refreshToken = await signToken(
        { userType },
        this.config.SIGN_REFRESH_TOKEN_PRIVATE_KEY,
        issuer,
        audience,
        userID,
        notBefore,
        now,
        now + 24 * 60 * 60 * 30
      );
    } catch (error) {
      console.log("unable to generate token, error: ", error);
      return null;
    }

    return [accessToken, refreshToken];
  }

  async verifyAccessToken(token, userTypes) {
    const secret = new TextEncoder().encode(this.config.SIGN_ACCESS_TOKEN_PRIVATE_KEY);
    try {
      const { payload } = await jwtVerify(token, secret, {
        issuer: this.config.SERVER_HOST_URL,
        audience: this.config.ALLOWED_ORIGIN_URL,
      });
      if (userTypes == null || !userTypes.includes(payload.userType)) {
        return [false, null];
      }
      return [true, payload.userType];
    } catch (error) {
      console.log("unable to verify token, error: ", error);
      return [false, null];
    }
  }

  async verifyRefreshToken(token) {
    const secret = new TextEncoder().encode(this.config.SIGN_REFRESH_TOKEN_PRIVATE_KEY);
    try {
      const { payload } = await jwtVerify(token, secret, {
        issuer: this.config.SERVER_HOST_URL,
        audience: this.config.ALLOWED_ORIGIN_URL,
      });
      return payload;
    } catch (error) {
      console.log("unable to verify token, error: ", error);
      return null;
    }
  }
}
