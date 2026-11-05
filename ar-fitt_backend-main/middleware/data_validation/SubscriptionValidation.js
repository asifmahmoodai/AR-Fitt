import Joi from "joi";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";

const subscriptionSchema = Joi.object({
  userEmail: Joi.string().email({ tlds: { allow: false } }).required(),
  priceID: Joi.string().required(),
});

export class SubscriptionValidation {
  validate(req, res, next) {
    const { userEmail, priceID } = req.body || {};
    const validationResult = subscriptionSchema.validate(
      { userEmail, priceID },
      { abortEarly: false }
    );
    if (validationResult.error) {
      return res
        .status(APIResponseConstants.BAD_REQUEST)
        .send(
          JSON.stringify(
            new APIResponseMessage(
              validationResult.error.details.map((detail) => detail.message).join(" "),
              APIResponseConstants.INVALID_DATA_IN_REQUEST
            )
          )
        );
    }
    next();
  }
}
