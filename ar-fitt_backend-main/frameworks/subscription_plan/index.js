import { SubscriptionPlanController } from "../../adapters/express/controllers/SubscriptionPlanController.js";
import { PaymentServiceAdapter } from "../../adapters/payment_service/PaymentServiceAdapter.js";
import { FetchSubscriptionPlanUseCase } from "../../usecases/subscription_plan/FetchSubscriptionPlan.js";
import { AuthServiceMiddleware } from "../../middleware/authorization_service/usecases/AuthServiceMiddleware.js";
import { Headers } from "../../middleware/common/headers.js";

// Rebuilt once per request (see adapters/hono/expressCompat.js) since the Prisma
// client itself must be constructed per request on Workers.
export function buildSubscriptionPlanController(appContext) {
  const paymentServiceAdapter = new PaymentServiceAdapter(appContext.config);
  const authServiceMiddleware = new AuthServiceMiddleware(appContext.config);
  const commonHeaders = new Headers();

  const fetchSubscriptionPlanUseCase = new FetchSubscriptionPlanUseCase(
    paymentServiceAdapter
  );

  return new SubscriptionPlanController(
    fetchSubscriptionPlanUseCase,
    authServiceMiddleware,
    commonHeaders
  );
}
