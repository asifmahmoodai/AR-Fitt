import { APIResponse } from "../../infra/utils/api_response/APIResponse.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { PaymentCheckoutSession } from "../../entities/PaymentCheckoutSession.js";

export class CreateSubscriptionUseCase {
  constructor(
    userRepository,
    paymentServiceAdapter,
    userSubscriptionRespository,
    paymentServiceUserRepository
  ) {
    this.userRepository = userRepository;
    this.paymentServiceAdapter = paymentServiceAdapter;
    this.userSubscriptionRespository = userSubscriptionRespository;
    this.paymentServiceUserRepository = paymentServiceUserRepository;
  }

  async execute(userEmail, priceID) {
    const [user, userError] = await this.userRepository.getUserByEmail(userEmail);
    if (userError) return this.internalError();
    if (!user) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.USER_NOT_EXIST_MESSAGE,
          APIResponseConstants.USER_NOT_EXIST_MESSAGE_CODE
        ),
        APIResponseConstants.ITEM_NOT_FOUND
      );
    }

    const userID = user.getID();
    if (typeof userID !== "string" || !userID.trim()) return this.internalError();

    const [userSubscription, subscriptionError] =
      await this.userSubscriptionRespository.getUserSubscriptionByUserID(userID);
    if (subscriptionError) return this.internalError();

    // A subscription record may exist before the first invoice is paid. In
    // either case, starting another Checkout session could charge twice.
    if (userSubscription) {
      return new APIResponse(
        new APIResponseMessage(
          "A subscription already exists for this user.",
          "subscription_already_exists"
        ),
        APIResponseConstants.CONFLICTED_REQUEST
      );
    }

    const [paymentServiceUser, customerError] =
      await this.paymentServiceUserRepository.getPaymentServiceUserByUserID(userID);
    if (customerError) return this.internalError();

    // Reuse the Stripe customer for renewals. The is_subscribed flag can lag
    // behind webhook updates, so it cannot determine which customer to use.
    const sessionParams = paymentServiceUser
      ? { customer: paymentServiceUser.getPaymentServiceUserID() }
      : { customer_email: user.getEmail() };

    const [checkoutURL, checkoutError] =
      await this.paymentServiceAdapter.createCheckoutSession(
        userID,
        priceID,
        sessionParams
      );
    if (
      checkoutError?.type === "StripeInvalidRequestError" &&
      checkoutError?.code === "resource_missing" &&
      checkoutError?.param === "line_items[0][price]"
    ) {
      return new APIResponse(
        new APIResponseMessage(
          "Subscription plan is unavailable. Please refresh the page and try again.",
          "invalid_subscription_price"
        ),
        APIResponseConstants.BAD_REQUEST
      );
    }
    if (checkoutError || !checkoutURL) return this.internalError();

    return new APIResponse(
      new APIResponseMessage(
        new PaymentCheckoutSession(checkoutURL),
        APIResponseConstants.PAYMENT_CHECKOUT_SESSSION_CREATED_MESSAGE_CODE
      ),
      APIResponseConstants.ITEM_CREATED_STATUS_CODE
    );
  }

  internalError() {
    return new APIResponse(
      new APIResponseMessage(
        APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
        APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
      ),
      APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE
    );
  }
}
