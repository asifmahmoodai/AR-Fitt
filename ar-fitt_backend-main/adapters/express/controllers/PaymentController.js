import { mountExpressController } from "../../hono/expressCompat.js";
import { APIResponseMessage } from "../../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../../infra/utils/api_response/APIResponseConstants.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

const defaultApiResponseMessage = new APIResponseMessage(
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
);

export class PaymentController {
  constructor(
    createSubscriptionUseCase,
    processWebhookEventsUseCase,
    updateSubscriptionUseCase,
    cancelSubscriptionUseCase,
    authServiceMiddleware,
    commonHeaders,
    emailValidation,
    subscriptionValidation
  ) {
    this.createSubscriptionUseCase = createSubscriptionUseCase;
    this.processWebhookEventsUseCase = processWebhookEventsUseCase;
    this.updateSubscriptionUseCase = updateSubscriptionUseCase;
    this.cancelSubscriptionUseCase = cancelSubscriptionUseCase;
    this.authServiceMiddleware = authServiceMiddleware;
    this.commonHeaders = commonHeaders;
    this.emailValidation = emailValidation;
    this.subscriptionValidation = subscriptionValidation;
  }

  async createSubscription(req, res) {
    const { userEmail, priceID } = req.body;
    const useCaseResponse = await this.createSubscriptionUseCase.execute(
      userEmail,
      priceID
    );

    if (useCaseResponse == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
    } else {
      res
        .status(useCaseResponse.getStatusCode())
        .send(JSON.stringify(useCaseResponse.getResponseMessage()));
    }
  }

  async processWebhookEvents(req, res) {
    // The Stripe webhook route is registered with { skipBodyParse: true } (see
    // registerRoutes below) so the request body is never JSON-parsed by the shim
    // -- signature verification needs the exact raw bytes Stripe signed.
    const rawBody = await req.raw.text();
    const useCaseResponse = await this.processWebhookEventsUseCase.execute(
      rawBody,
      req.headers[CommonConstants.STRIPE_SIGNATURE]
    );
    if (useCaseResponse == null) {
      return res.sendStatus(APIResponseConstants.BAD_REQUEST);
    }
    res.sendStatus(useCaseResponse.getStatusCode());
  }

  async updateSubscription(req, res) {
    const { userEmail, priceID } = req.body;
    const useCaseResponse = await this.updateSubscriptionUseCase.execute(
      userEmail,
      priceID
    );

    if (useCaseResponse == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
    } else {
      res
        .status(useCaseResponse.getStatusCode())
        .send(JSON.stringify(useCaseResponse.getResponseMessage()));
    }
  }

  async cancelSubscription(req, res) {
    const userEmail = req.query.email;
    const useCaseResponse = await this.cancelSubscriptionUseCase.execute(
      userEmail
    );
    if (useCaseResponse == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
    } else {
      res
        .status(useCaseResponse.getStatusCode())
        .send(JSON.stringify(useCaseResponse.getResponseMessage()));
    }
  }

  static registerRoutes(app, buildController) {
    const router = mountExpressController(app, buildController);
    router.post(
      "/payment/createSubscription",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      // (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ONLY_REGISTERED_USER_ACCESS, req, res, next),
      (c, req, res, next) => c.subscriptionValidation.validate(req, res, next),
      (c, req, res) => c.createSubscription(req, res)
    );
    router.post(
      "/payment/webhook",
      { skipBodyParse: true },
      (c, req, res) => c.processWebhookEvents(req, res)
    );
    router.post(
      "/payment/updateSubscription",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ONLY_REGISTERED_USER_ACCESS, req, res, next),
      (c, req, res, next) => c.subscriptionValidation.validate(req, res, next),
      (c, req, res) => c.updateSubscription(req, res)
    );
    router.get(
      "/payment/cancelSubscription",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ONLY_REGISTERED_USER_ACCESS, req, res, next),
      (c, req, res, next) => c.emailValidation.validate(req, res, next),
      (c, req, res) => c.cancelSubscription(req, res)
    );
  }
}
