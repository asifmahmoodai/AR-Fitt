import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAppContext } from "./infra/config/environment/AppContext.js";
import { CommonConstants } from "./infra/utils/common/Constants.js";

import { InventoryCategoryController } from "./adapters/express/controllers/InventoryCategoryController.js";
import { buildInventoryCategoryController } from "./frameworks/inventory_category/index.js";
import { InventoryItemController } from "./adapters/express/controllers/InventoryItemController.js";
import { buildInventoryItemController } from "./frameworks/inventory_item/index.js";

import { UserController } from "./adapters/express/controllers/UserController.js";
import { buildUserController } from "./frameworks/user/index.js";
import { AuthorizationServiceController } from "./adapters/express/controllers/AuthorizationServiceController.js";
import { buildAuthorizationServiceController } from "./frameworks/authorization_service/index.js";
import { GuestUserController } from "./adapters/express/controllers/GuestUserController.js";
import { buildGuestUserController } from "./frameworks/guest_user/index.js";

import { UserBodyMatrixController } from "./adapters/express/controllers/UserBodyMatrixController.js";
import { buildUserBodyMatrixController } from "./frameworks/user_body_matrix/index.js";
import { UserFaceMatrixController } from "./adapters/express/controllers/UserFaceMatrixController.js";
import { buildUserFaceMatrixController } from "./frameworks/user_face_matrix/index.js";
import { UserBodyImageController } from "./adapters/express/controllers/UserBodyImageController.js";
import { buildUserBodyImageController } from "./frameworks/user_body_image/index.js";
import { UserFaceImageController } from "./adapters/express/controllers/UserFaceImageController.js";
import { buildUserFaceImageController } from "./frameworks/user_face_image/index.js";

import { PaymentController } from "./adapters/express/controllers/PaymentController.js";
import { buildPaymentController } from "./frameworks/payment/index.js";
import { SubscriptionPlanController } from "./adapters/express/controllers/SubscriptionPlanController.js";
import { buildSubscriptionPlanController } from "./frameworks/subscription_plan/index.js";

import { AdminAuthController } from "./adapters/express/controllers/AdminAuthController.js";
import { buildAdminAuthController } from "./frameworks/admin_auth/index.js";
import { AdminUserController } from "./adapters/express/controllers/AdminUserController.js";
import { buildAdminUserController } from "./frameworks/admin_user/index.js";
import { AdminCategoryController } from "./adapters/express/controllers/AdminCategoryController.js";
import { buildAdminCategoryController } from "./frameworks/admin_category/index.js";
import { AdminProductController } from "./adapters/express/controllers/AdminProductController.js";
import { buildAdminProductController } from "./frameworks/admin_product/index.js";
import { AppReleaseController } from "./adapters/express/controllers/AppReleaseController.js";
import { buildAppReleaseController } from "./frameworks/app_release/index.js";

const app = new Hono();

app.use("*", async (c, next) => {
  return cors({
    origin: process.env.ALLOWED_ORIGIN_URL || "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "x-admin-auth-token",
      "admin-authorization",
      "x-admin-refresh-token",
    ],
    exposeHeaders: [CommonConstants.ACCESS_TOKEN, CommonConstants.REFRESH_TOKEN],
    credentials: true,
  })(c, next);
});

app.use("*", async (c, next) => {
  c.set("appContext", createAppContext(process.env));
  await next();
});

InventoryCategoryController.registerRoutes(app, buildInventoryCategoryController);
InventoryItemController.registerRoutes(app, buildInventoryItemController);

UserController.registerRoutes(app, buildUserController);
AuthorizationServiceController.registerRoutes(app, buildAuthorizationServiceController);
GuestUserController.registerRoutes(app, buildGuestUserController);

UserBodyMatrixController.registerRoutes(app, buildUserBodyMatrixController);
UserFaceMatrixController.registerRoutes(app, buildUserFaceMatrixController);
UserBodyImageController.registerRoutes(app, buildUserBodyImageController);
UserFaceImageController.registerRoutes(app, buildUserFaceImageController);

PaymentController.registerRoutes(app, buildPaymentController);
SubscriptionPlanController.registerRoutes(app, buildSubscriptionPlanController);

AdminAuthController.registerRoutes(app, buildAdminAuthController);
AdminUserController.registerRoutes(app, buildAdminUserController);
AdminCategoryController.registerRoutes(app, buildAdminCategoryController);
AdminProductController.registerRoutes(app, buildAdminProductController);
AppReleaseController.registerRoutes(app, buildAppReleaseController);

export default app;
