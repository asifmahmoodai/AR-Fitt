import { buildPrismaClient } from "../../db/prismaClient.js";
import { LocalDiskBucket } from "../../storage/LocalDiskBucket.js";
import { InMemoryKV } from "../../kv/InMemoryKV.js";

// Built once for the life of the Node process — this app runs as a normal
// persistent VPS server, not on Workers, so there's no per-isolate/per-request
// reconstruction needed the way there would be on the edge.
const prisma = buildPrismaClient();
const productImagesBucket = new LocalDiskBucket(process.env.PRODUCT_IMAGES_DIR || "product_images");
const adminSessionsKV = new InMemoryKV();

export function createAppContext(env = process.env) {
  const config = {
    ALLOWED_ORIGIN_URL: env.ALLOWED_ORIGIN_URL || "",
    SERVER_HOST_URL: env.SERVER_HOST_URL || "",
    FORGET_PASSWORD_URL: env.FORGET_PASSWORD_URL || "",
    FORGET_PASSWORD_EMAIL_SENDER: env.FORGET_PASSWORD_EMAIL_SENDER || "",
    EMAIL_SERVICE_API_KEY_VALUE: env.EMAIL_SERVICE_API_KEY_VALUE || "",
    PAYMENT_SERVICE_API_KEY: env.PAYMENT_SERVICE_API_KEY || "",
    PAYMENT_SERVICE_SUCCESS_URL: env.PAYMENT_SERVICE_SUCCESS_URL || "",
    PAYMENT_SERVICE_CANCEL_URL: env.PAYMENT_SERVICE_CANCEL_URL || "",
    PAYMENT_SERVICE_WEBHOOK_API_KEY: env.PAYMENT_SERVICE_WEBHOOK_API_KEY || "",
    SIGN_ACCESS_TOKEN_PRIVATE_KEY: env.SIGN_ACCESS_TOKEN_PRIVATE_KEY || "",
    SIGN_REFRESH_TOKEN_PRIVATE_KEY: env.SIGN_REFRESH_TOKEN_PRIVATE_KEY || "",
  };

  return { config, prisma, productImagesBucket, adminSessionsKV };
}
