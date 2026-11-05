import { PaymentController } from "../../adapters/express/controllers/PaymentController.js";
import { UserRepository } from "../../adapters/database/repositories/UserRepository.js";
import { UserSubscriptionRepository } from "../../adapters/database/repositories/UserSubscriptionRepository.js";
import { PaymentServiceUserRespository } from "../../adapters/database/repositories/PaymentServiceUserRepository.js";
import { PaymentServiceAdapter } from "../../adapters/payment_service/PaymentServiceAdapter.js";
import { CreateSubscriptionUseCase } from "../../usecases/payment/CreateSubscription.js";
import { ProcessWebhookEventsUseCase } from "../../usecases/payment/ProcessWebhookEvents.js";
import { UpdateSubscriptionUseCase } from "../../usecases/payment/UpdateSubscription.js";
import { CancelSubscriptionUseCase } from "../../usecases/payment/CancelSubscription.js";
import { AuthServiceMiddleware } from "../../middleware/authorization_service/usecases/AuthServiceMiddleware.js";
import { Headers } from "../../middleware/common/headers.js";
import { EmailValidation } from "../../middleware/data_validation/EmailValidation.js";
import { SubscriptionValidation } from "../../middleware/data_validation/SubscriptionValidation.js";

// Rebuilt once per request (see adapters/hono/expressCompat.js) since the Prisma
// client itself must be constructed per request on Workers.
export function buildPaymentController(appContext) {
  const paymentServiceAdapter = new PaymentServiceAdapter(appContext.config);
  const userRepository = new UserRepository(appContext.prisma);
  const userSubscriptionRepository = new UserSubscriptionRepository(appContext.prisma);
  const paymentServiceUserRespository = new PaymentServiceUserRespository(appContext.prisma);
  const authServiceMiddleware = new AuthServiceMiddleware(appContext.config);
  const commonHeaders = new Headers();
  const emailValidation = new EmailValidation();
  const subscriptionValidation = new SubscriptionValidation();

  const createSubscriptionUseCase = new CreateSubscriptionUseCase(
    userRepository,
    paymentServiceAdapter,
    userSubscriptionRepository,
    paymentServiceUserRespository
  );
  const processWebhookEventsUseCase = new ProcessWebhookEventsUseCase(
    userRepository,
    paymentServiceAdapter,
    userSubscriptionRepository,
    paymentServiceUserRespository
  );
  const updateSubscriptionUseCase = new UpdateSubscriptionUseCase(
    userRepository,
    paymentServiceAdapter,
    userSubscriptionRepository
  );

  const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(
    userRepository,
    paymentServiceAdapter,
    userSubscriptionRepository
  );

  return new PaymentController(
    createSubscriptionUseCase,
    processWebhookEventsUseCase,
    updateSubscriptionUseCase,
    cancelSubscriptionUseCase,
    authServiceMiddleware,
    commonHeaders,
    emailValidation,
    subscriptionValidation
  );
}
