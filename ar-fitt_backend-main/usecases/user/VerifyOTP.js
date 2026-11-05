import { APIResponse } from "../../infra/utils/api_response/APIResponse.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { CommonConstants } from "../../infra/utils/common/Constants.js";
import { verifyPassword } from "../../middleware/crypto/passwordHashing.js";

export class VerifyOTPUseCase {
  constructor(userOTPRespository, userRepository) {
    this.userOTPRespository = userOTPRespository;
    this.userRepository = userRepository;
  }

  async execute(email, otp) {
    const repoReturnedValues = await this.userOTPRespository.getUserOTPByEmail(
      email
    );
    const userOTP = repoReturnedValues[0];
    const repoError = repoReturnedValues[1];

    if (repoError != null) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
        ),
        APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE
      );
    }

    if (!userOTP) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INVALID_OTP_MESSAGE,
          APIResponseConstants.INVALID_OTP_MESSAGE_CODE
        ),
        APIResponseConstants.FORBIDDEN_REQUEST
      );
    }

    const currentDateTime = new Date().getTime();
    const otpExpirationDateTime = CommonConstants.OTP_VALIDATION_SECONDS;
    const otpRequestTime = new Date(userOTP.getCreatedAt());

    if (currentDateTime - otpRequestTime.getTime() >= otpExpirationDateTime) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.EXPIRED_OTP_MESSAGE,
          APIResponseConstants.EXPIRED_OTP_MESSAGE_CODE
        ),
        APIResponseConstants.FORBIDDEN_REQUEST
      );
    }

    if (!(await verifyPassword(otp, userOTP.getOTPHash()))) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INVALID_OTP_MESSAGE,
          APIResponseConstants.INVALID_OTP_MESSAGE_CODE
        ),
        APIResponseConstants.FORBIDDEN_REQUEST
      );
    }

    await this.userRepository.markUserVerified(email);

    return new APIResponse(
      new APIResponseMessage(
        APIResponseConstants.VALID_OTP_MESSAGE,
        APIResponseConstants.VALID_OTP_MESSAGE_CODE
      ),
      APIResponseConstants.SUCCESS_STATUS_CODE
    );
  }
}
