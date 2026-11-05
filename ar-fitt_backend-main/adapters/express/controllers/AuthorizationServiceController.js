import { mountExpressController } from "../../hono/expressCompat.js";
import { APIResponseMessage } from "../../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../../infra/utils/api_response/APIResponseConstants.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

const invalidTokenResponse = new APIResponseMessage(
  APIResponseConstants.INVALID_TOKEN_MESSAGE,
  APIResponseConstants.INVALID_TOKEN_CODE
);

export class AuthorizationServiceController {
  constructor(refreshTokenUseCase, commonHeaders) {
    this.refreshTokenUseCase = refreshTokenUseCase;
    this.commonHeaders = commonHeaders;
  }

  async refreshToken(req, res) {
    const refreshToken = req.headers.refresh_token;
    const clientType = req.headers.client_type;

    if (clientType != CommonConstants.CLIENT_TYPE_MOBILE) {
      res
        .status(APIResponseConstants.INVALID_TOKEN_STATUS_CODE)
        .send(JSON.stringify(invalidTokenResponse));
      return;
    }

    const useCaseResponse = await this.refreshTokenUseCase.execute(
      refreshToken,
      clientType,
      CommonConstants.ONLY_REGISTERED_USER_ACCESS
    );

    if (useCaseResponse == null) {
      res
        .status(APIResponseConstants.INVALID_TOKEN_STATUS_CODE)
        .send(JSON.stringify(invalidTokenResponse));
    } else {
      res
        .status(useCaseResponse.getStatusCode())
        .send(JSON.stringify(useCaseResponse.getResponseMessage()));
    }
    return;
  }

  static registerRoutes(app, buildController) {
    const router = mountExpressController(app, buildController);
    router.post(
      "/refreshToken",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res) => c.refreshToken(req, res)
    );
  }
}
