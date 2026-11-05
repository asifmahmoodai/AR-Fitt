import Joi from "joi";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";

const emailSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
});

export class EmailValidation {
  validate(req, res, next) {
    const email = req.query.email;
    const validationResult = emailSchema.validate({ email });
    if (validationResult.error) {
      return res
        .status(APIResponseConstants.BAD_REQUEST)
        .send(
          JSON.stringify(
            new APIResponseMessage(
              validationResult.error,
              APIResponseConstants.INVALID_DATA_IN_REQUEST
            )
          )
        );
    }

    next();
  }
}
