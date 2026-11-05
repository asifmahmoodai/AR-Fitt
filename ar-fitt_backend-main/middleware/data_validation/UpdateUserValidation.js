import Joi from "joi";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";

const updateUserSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  firstName: Joi.string().when({
    is: Joi.string().empty(""),
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  lastName: Joi.string().when({
    is: Joi.string().empty(""),
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  phone: Joi.string().when({
    is: Joi.string().empty(""),
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  gender: Joi.string().when({
    is: Joi.string().empty(""),
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  dob: Joi.string()
    .isoDate()
    .when({
      is: Joi.string().empty(""),
      then: Joi.optional(),
      otherwise: Joi.string().isoDate().required(),
    }),
});

export class UpdateUserValidation {
  validate(req, res, next) {
    const { email, firstName, lastName, phone, gender, dob } = req.body;
    const validationResult = updateUserSchema.validate(
      { email, firstName, lastName, phone, gender, dob },
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
