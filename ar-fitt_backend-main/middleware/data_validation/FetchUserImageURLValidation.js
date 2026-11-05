import Joi from "joi";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";

const fetchUserImageURLValidation = Joi.object({
  userID: Joi.string().when({
    is: Joi.string().empty(""),
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  email: Joi.string().when({
    is: Joi.string().email({ tlds: { allow: false } }).empty(""),
    then: Joi.optional(),
    otherwise: Joi.string().email({ tlds: { allow: false } }).required(),
  }),
});

export class FetchUserImageURLValidation {
  validate(req, res, next) {
    const email = req.query.email;
    const userID = req.query.userID;
    const validationResult = fetchUserImageURLValidation.validate(
      {
        userID,
        email,
      },
      { abortEarly: false }
    );
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
