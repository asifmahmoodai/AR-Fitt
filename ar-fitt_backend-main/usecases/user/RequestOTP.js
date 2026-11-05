import { v4 } from "uuid";
import otpGenerator from "otp-generator";
import util from "util";
import { CommonConstants } from "../../infra/utils/common/Constants.js";
import { UserOTP } from "../../entities/UserOTP.js";
import { APIResponse } from "../../infra/utils/api_response/APIResponse.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { hashPassword } from "../../middleware/crypto/passwordHashing.js";

export class RequestOTPUseCase {
  constructor(userOTPRespository, emailServiceAdapter) {
    this.userOTPRespository = userOTPRespository;
    this.emailServiceAdapter = emailServiceAdapter;
  }

  async execute(email) {
    const otp = otpGenerator.generate(CommonConstants.OTP_LENGTH, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    var currentDateTime = new Date().toISOString();
    const otpHash = await hashPassword(otp);
    const newUserOTP = new UserOTP(
      v4(),
      email,
      otpHash,
      currentDateTime,
      currentDateTime
    );

    const repoError = await this.userOTPRespository.createUserOTP(newUserOTP);
    if (repoError != null) {
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
      CommonConstants.OTP_EMAIL_SUBJECT,
      util.format(CommonConstants.OTP_EMAIL_MESSAGE, otp)
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
        APIResponseConstants.OTP_EMAIL_SENT_MESSAGE,
        APIResponseConstants.OTP_EMAIL_SENT_MESSAGE_CODE
      ),
      APIResponseConstants.SUCCESS_STATUS_CODE
    );
  }
}
