import Joi from "joi";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";

const userSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  gender: Joi.string().required(),
  dob: Joi.string().isoDate().required(),
});

export class UserValidation {
  validate(req, res, next) {
    const { email, firstName, lastName, phone, password, gender, dob } =
      req.body;
    const validationResult = userSchema.validate(
      { email, firstName, lastName, password, phone, gender, dob },
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
