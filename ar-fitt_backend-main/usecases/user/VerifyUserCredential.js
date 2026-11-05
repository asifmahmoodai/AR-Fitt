import { APIResponse } from "../../infra/utils/api_response/APIResponse.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { User } from "../../entities/User.js";
import { verifyPassword } from "../../middleware/crypto/passwordHashing.js";

export class VerifyUserCredentialUseCase {
  constructor(userRepository, userCredentialRepository) {
    this.userRepository = userRepository;
    this.userCredentialRepository = userCredentialRepository;
  }

  async execute(email, password) {
    var repoReturnedValues =
      await this.userCredentialRepository.getUserCredentialByEmail(email);
    const existingUserCredential = repoReturnedValues[0];
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

    if (!existingUserCredential) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INVALID_USER_CREDENTIAL_MESSAGE,
          APIResponseConstants.INVALID_USER_CREDENTIAL_MESSAGE_CODE
        ),
        APIResponseConstants.INVALID_USER_CREDENTIAL_STATUS_CODE
      );
    }

    if (
      !(await verifyPassword(password, existingUserCredential.getPasswordHash()))
    ) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INVALID_USER_CREDENTIAL_MESSAGE,
          APIResponseConstants.INVALID_USER_CREDENTIAL_MESSAGE_CODE
        ),
        APIResponseConstants.INVALID_USER_CREDENTIAL_STATUS_CODE
      );
    }

    repoReturnedValues = await this.userRepository.getUserByEmail(email);
    const plainUser = repoReturnedValues[0];
    const existingUser = Object.setPrototypeOf(plainUser, User.prototype);
    existingUser.recommendedSize = repoReturnedValues[2];

    console.log("Existing User123:", existingUser);

    repoError = repoReturnedValues[1];

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
          APIResponseConstants.INVALID_USER_CREDENTIAL_MESSAGE,
          APIResponseConstants.INVALID_USER_CREDENTIAL_MESSAGE_CODE
        ),
        APIResponseConstants.INVALID_USER_CREDENTIAL_STATUS_CODE
      );
    }

    return new APIResponse(
      new APIResponseMessage(
        existingUser,
        APIResponseConstants.USER_EXIST_MESSAGE_CODE
      ),
      APIResponseConstants.SUCCESS_STATUS_CODE
    );
  }
}
