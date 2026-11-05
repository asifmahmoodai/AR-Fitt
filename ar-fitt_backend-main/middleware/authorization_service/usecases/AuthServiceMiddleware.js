import { AuthService } from "./AuthService.js";
import { APIResponseMessage } from "../../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../../infra/utils/api_response/APIResponseConstants.js";

const invalidTokenResponse = new APIResponseMessage(
  APIResponseConstants.INVALID_TOKEN_MESSAGE,
  APIResponseConstants.INVALID_TOKEN_CODE
);

export class AuthServiceMiddleware {
  constructor(config) {
    this.config = config;
  }

  async verifyToken(userTypes, req, res, next) {
    const authService = new AuthService(this.config);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(APIResponseConstants.INVALID_TOKEN_STATUS_CODE)
        .send(JSON.stringify(invalidTokenResponse));
    }

    const returnedValues = await authService.verifyAccessToken(token, userTypes);
    if (!returnedValues[0]) {
      return res
        .status(APIResponseConstants.INVALID_TOKEN_STATUS_CODE)
        .send(JSON.stringify(invalidTokenResponse));
    }

    req.userType = returnedValues[1];
    return next();
  }
}
