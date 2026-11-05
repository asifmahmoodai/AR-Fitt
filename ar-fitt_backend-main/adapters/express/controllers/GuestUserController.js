import { mountExpressController } from "../../hono/expressCompat.js";
import { APIResponseMessage } from "../../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../../infra/utils/api_response/APIResponseConstants.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

const defaultApiResponseMessage = new APIResponseMessage(
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
);

export class GuestUserController {
  constructor(
    registerGuestUseCase,
    authService,
    commonHeaders,
    guestUserValidation
  ) {
    this.registerGuestUseCase = registerGuestUseCase;
    this.authService = authService;
    this.commonHeaders = commonHeaders;
    this.guestUserValidation = guestUserValidation;
  }

  async registerGuestUser(req, res) {
    const { gender, dob } = req.body;
    const useCaseResponse = await this.registerGuestUseCase.execute(
      gender,
      dob
    );

    if (useCaseResponse == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
      return;
    }

    if (
      useCaseResponse.getResponseMessage().getMessageCode() !=
      APIResponseConstants.GUEST_USER_REGISTERED_MESSAGE_CODE
    ) {
      res
        .status(useCaseResponse.getStatusCode())
        .send(JSON.stringify(useCaseResponse.getResponseMessage()));
      return;
    }

    const clientType = req.headers[CommonConstants.CLIENT_TYPE];
    const token = await this.authService.generateToken(
      useCaseResponse.getResponseMessage().getMessage().getID(),
      clientType,
      CommonConstants.GUEST_USER_TYPE
    );
    if (token == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
      return;
    }

    switch (clientType) {
      case CommonConstants.CLIENT_TYPE_WEB:
        res.set(CommonConstants.ACCESS_TOKEN, token);
        break;
      case CommonConstants.CLIENT_TYPE_MOBILE:
        res.set(CommonConstants.ACCESS_TOKEN, token[0]);
        res.set(CommonConstants.REFRESH_TOKEN, token[1]);
        break;
      default:
        res.set(CommonConstants.ACCESS_TOKEN, token);
        break;
    }

    res
      .status(useCaseResponse.getStatusCode())
      .send(JSON.stringify(useCaseResponse.getResponseMessage()));
  }

  static registerRoutes(app, buildController) {
    const router = mountExpressController(app, buildController);
    router.post(
      "/signUpGuest",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.guestUserValidation.validate(req, res, next),
      (c, req, res) => c.registerGuestUser(req, res)
    );
  }
}
