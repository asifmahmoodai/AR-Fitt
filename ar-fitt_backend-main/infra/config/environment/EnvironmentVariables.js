import process from "process";
import { config } from "dotenv";

config();

export const EnvironmentVariables = {
  EXPRESS_APP_PORT: process.env.EXPRESS_APP_PORT || "",
  EMAIL_SERVICE_API_KEY_NAME: process.env.EMAIL_SERVICE_API_KEY_NAME || "",
  EMAIL_SERVICE_API_KEY_VALUE: process.env.EMAIL_SERVICE_API_KEY_VALUE || "",
  FORGET_PASSWORD_EMAIL_SENDER: process.env.FORGET_PASSWORD_EMAIL_SENDER || "",
  FORGET_PASSWORD_URL: process.env.FORGET_PASSWORD_URL || "",
  ALLOWED_ORIGIN_URL: process.env.ALLOWED_ORIGIN_URL || "",
  SERVER_HOST_URL: process.env.SERVER_HOST_URL || "",
  PAYMENT_SERVICE_API_KEY: process.env.PAYMENT_SERVICE_API_KEY || "",
  PAYMENT_SERVICE_SUCCESS_URL: process.env.PAYMENT_SERVICE_SUCCESS_URL || "",
  PAYMENT_SERVICE_CANCEL_URL: process.env.PAYMENT_SERVICE_CANCEL_URL || "",
  PAYMENT_SERVICE_WEBHOOK_API_KEY:
    process.env.PAYMENT_SERVICE_WEBHOOK_API_KEY || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
  SIGN_ACCESS_TOKEN_PRIVATE_KEY:
    process.env.SIGN_ACCESS_TOKEN_PRIVATE_KEY || "your-super-secret-access-token-key-here-must-be-very-long-and-secure-for-jwt-signing",
  SIGN_REFRESH_TOKEN_PRIVATE_KEY:
    process.env.SIGN_REFRESH_TOKEN_PRIVATE_KEY || "your-super-secret-refresh-token-key-here-must-be-very-long-and-secure-for-jwt-signing",
};
