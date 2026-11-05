import Joi from "joi";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";

const userCredentialSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

export class UserCredentialValidation {
  validate(req, res, next) {
    const { email, password } = req.body;
    const validationResult = userCredentialSchema.validate(
      {
        email,
        password,
      },
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
