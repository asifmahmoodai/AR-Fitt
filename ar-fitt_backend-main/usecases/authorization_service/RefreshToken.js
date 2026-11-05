import { APIResponse } from "../../infra/utils/api_response/APIResponse.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { RefreshTokenResponse } from "../../entities/RefreshTokenResponse.js";

export class RefreshTokenUseCase {
  constructor(authServiceMiddleware) {
    this.authServiceMiddleware = authServiceMiddleware;
  }

  async execute(refreshToken, clientType, userTypes) {
    const refreshTokenPayload =
      await this.authServiceMiddleware.verifyRefreshToken(refreshToken);
    if (refreshTokenPayload == null) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INVALID_TOKEN_MESSAGE,
          APIResponseConstants.INVALID_TOKEN_CODE
        ),
        APIResponseConstants.INVALID_TOKEN_STATUS_CODE
      );
    }

    if (
      userTypes == null ||
      (userTypes != null &&
        !userTypes.includes(refreshTokenPayload["userType"]))
    ) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INVALID_TOKEN_MESSAGE,
          APIResponseConstants.INVALID_TOKEN_CODE
        ),
        APIResponseConstants.INVALID_TOKEN_STATUS_CODE
      );
    }

    const token = await this.authServiceMiddleware.generateToken(
      refreshTokenPayload["sub"],
      clientType,
      refreshTokenPayload["userType"]
    );

    if (token == null) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INVALID_TOKEN_MESSAGE,
          APIResponseConstants.INVALID_TOKEN_CODE
        ),
        APIResponseConstants.INVALID_TOKEN_STATUS_CODE
      );
    }

    return new APIResponse(
      new RefreshTokenResponse(token[0], token[1]),
      APIResponseConstants.SUCCESS_STATUS_CODE
    );
  }
}
