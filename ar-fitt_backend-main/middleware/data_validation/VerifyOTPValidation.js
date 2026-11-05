import Joi from "joi";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";
import { CommonConstants } from "../../infra/utils/common/Constants.js";

const verifyOTPSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  otp: Joi.string()
    .min(CommonConstants.OTP_LENGTH)
    .max(CommonConstants.OTP_LENGTH)
    .required(),
});

export class VerifyOTPValidation {
  validate(req, res, next) {
    const { email, otp } = req.body;
    const validationResult = verifyOTPSchema.validate(
      { email, otp },
      { abortEarly: false }
    );
    if (validationResult.error) {
      return res
        .status(APIResponseConstants.BAD_REQUEST)
        .send(
          new APIResponseMessage(
            validationResult.error,
            APIResponseConstants.INVALID_DATA_IN_REQUEST
          )
        );
    }
    next();
  }
}
