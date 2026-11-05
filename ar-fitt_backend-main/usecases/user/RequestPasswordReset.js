import util from "util";
import { CommonConstants } from "../../infra/utils/common/Constants.js";
import { APIResponse } from "../../infra/utils/api_response/APIResponse.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";

export class RequestPasswordResetUseCase {
  constructor(emailServiceAdapter, userRepository, authService, config) {
    this.emailServiceAdapter = emailServiceAdapter;
    this.userRepository = userRepository;
    this.authService = authService;
    this.config = config;
  }

  async execute(email) {
    var repoReturnedValues = await this.userRepository.getUserByEmail(email);
    const existingUser = repoReturnedValues[0];
    var repoError = repoReturnedValues[1];

    if (repoError != null) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
        ),
        APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE
      );
    }

    if (!existingUser) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.USER_NOT_EXIST_MESSAGE,
          APIResponseConstants.USER_NOT_EXIST_MESSAGE_CODE
        ),
        APIResponseConstants.ITEM_NOT_FOUND
      );
    }

    const token = await this.authService.generateToken(
      existingUser.getID(),
      CommonConstants.CLIENT_TYPE_WEB,
      CommonConstants.REGISTERED_USER_TYPE
    );
    if (token == null) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
        ),
        APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE
      );
    }

    const adapterError = await this.emailServiceAdapter.sendEmail(
      email,
      CommonConstants.RESET_PASSWORD_EMAIL_SUBJECT,
      util.format(
        CommonConstants.RESET_PASSWORD_EMAIL_MESSAGE,
        util.format(this.config.FORGET_PASSWORD_URL, token)
      )
    );
    if (adapterError != null) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
        ),
        APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE
      );
    }
    return new APIResponse(
      new APIResponseMessage(
        APIResponseConstants.USER_CREDENTIAL_RESET_EMAIL_MESSAGE,
        APIResponseConstants.USER_CREDENTIAL_RESET_EMAIL_MESSAGE_CODE
      ),
      APIResponseConstants.SUCCESS_STATUS_CODE
    );
  }
}
