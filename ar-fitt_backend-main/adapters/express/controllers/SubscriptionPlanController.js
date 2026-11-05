import { mountExpressController } from "../../hono/expressCompat.js";
import { APIResponseMessage } from "../../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../../infra/utils/api_response/APIResponseConstants.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

const defaultApiResponseMessage = new APIResponseMessage(
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
);

export class SubscriptionPlanController {
  constructor(
    fetchSubscriptionPlanUseCase,
    authServiceMiddleware,
    commonHeaders
  ) {
    this.fetchSubscriptionPlanUseCase = fetchSubscriptionPlanUseCase;
    this.authServiceMiddleware = authServiceMiddleware;
    this.commonHeaders = commonHeaders;
  }

  async getSubscriptions(_, res) {
    const useCaseResponse = await this.fetchSubscriptionPlanUseCase.execute();
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
    router.get(
      "/subscriptionPlans",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ONLY_REGISTERED_USER_ACCESS, req, res, next),
      (c, req, res) => c.getSubscriptions(req, res)
    );
  }
}
