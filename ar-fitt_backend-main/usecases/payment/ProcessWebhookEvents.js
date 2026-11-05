import { PaymentServiceUser } from "../../entities/PaymentServiceUser.js";
import { UserSubscription } from "../../entities/UserSubscription.js";
import { APIResponse } from "../../infra/utils/api_response/APIResponse.js";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { CommonConstants } from "../../infra/utils/common/Constants.js";

export class ProcessWebhookEventsUseCase {
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

  async execute(requestBody, signature) {
    let repoReturnedValues =
      await this.paymentServiceAdapter.verifyWebhookSignature(
        requestBody,
        signature
      );

    if (
      repoReturnedValues[2] != null ||
      !repoReturnedValues[0] ||
      !repoReturnedValues[1]
    ) {
      return new APIResponse(null, APIResponseConstants.BAD_REQUEST);
    }

    const eventData = repoReturnedValues[0];
    const eventType = repoReturnedValues[1];

    let eventHanlderError;
    switch (eventType) {
      case CommonConstants.PAYMENT_SERVICE_CUSTOMER_CREATED:
        eventHanlderError = await this.createPaymentServiceUser(eventData);
        break;
      case CommonConstants.PAYMENT_SERVICE_CUSTOMER_SUBSCRIPTION_CREATED:
        eventHanlderError = await this.createUserSubscription(eventData);
        break;
      case CommonConstants.PAYMENT_SERVICE_INVOICE_PAID:
        eventHanlderError = await this.updateUserSubscriptionStatus(eventData);
        break;
      case CommonConstants.PAYMENT_SERVICE_CUSTOMER_SUBSCRIPTION_UPDATED:
        eventHanlderError = await this.updateUserSubscription(eventData);
        this.updateSubscriptionCancellationAtPeriodEnd(eventData);
        break;
      case CommonConstants.PAYMENT_SERVICE_CUSTOMER_SUBSCRIPTION_DELETED:
        eventHanlderError = await this.deleteSubscription(eventData);
        break;
      case CommonConstants.PAYMENT_SERVICE_INVOIDCE_PAYMENT_FAILED:
        eventHanlderError = await this.deleteSubscription(eventData);
        break;
    }
    if (eventHanlderError != null) {
      return new APIResponse(null, APIResponseConstants.BAD_REQUEST);
    }

    return new APIResponse(null, APIResponseConstants.SUCCESS_STATUS_CODE);
  }

  async createPaymentServiceUser(eventData) {
    const userEmail = eventData["object"]["email"];
    const repoReturnedValues = await this.userRepository.getUserByEmail(
      userEmail
    );
    if (repoReturnedValues[1] != null || !repoReturnedValues[0]) {
      return repoReturnedValues[1];
    }

    const userID = repoReturnedValues[0].getID();
    const paymentServiceUserID = eventData["object"]["id"];
    const currentDateTime = new Date().toISOString();
    return await this.paymentServiceUserRepository.createPaymentServiceUser(
      new PaymentServiceUser(
        userID,
        paymentServiceUserID,
        currentDateTime,
        currentDateTime
      )
    );
  }

  async createUserSubscription(eventData) {
    const paymentServiceUserID = eventData["object"]["customer"];
    const repoReturnedValues =
      await this.paymentServiceUserRepository.getPaymentServiceUserByPaymentServiceUserID(
        paymentServiceUserID
      );
    if (repoReturnedValues[1] != null || !repoReturnedValues[0]) {
      return repoReturnedValues[1];
    }
    const userID = repoReturnedValues[0].getUserID();
    const productID = eventData["object"]["plan"]["product"];
    const subscriptionID = eventData["object"]["id"];
    const currentDateTime = new Date().toISOString();
    return await this.userSubscriptionRespository.createUserSubscription(
      new UserSubscription(
        userID,
        productID,
        subscriptionID,
        currentDateTime,
        currentDateTime
      )
    );
  }

  async updateUserSubscriptionStatus(eventData) {
    const userEmail = eventData["object"]["customer_email"];
    return await this.userRepository.markeUserSubscribed(userEmail);
  }

  async updateUserSubscription(eventData) {
    const paymentServiceUserID = eventData["object"]["customer"];
    let repoReturnedValues =
      await this.paymentServiceUserRepository.getPaymentServiceUserByPaymentServiceUserID(
        paymentServiceUserID
      );
    if (repoReturnedValues[1] != null || !repoReturnedValues[0]) {
      return repoReturnedValues[1];
    }
    const userID = repoReturnedValues[0].getUserID();

    repoReturnedValues =
      await this.userSubscriptionRespository.getUserSubscriptionByUserID(
        userID
      );
    // we won't update and raise an error if a subscription doesn't exist, it might be a new subscription creation or renewal
    if (repoReturnedValues[1] != null) {
      return repoReturnedValues[1];
    }

    if (!repoReturnedValues[0]) {
      // creating user subscription incase of payment failures earlier
      await this.createUserSubscription(eventData);
      return null;
    }

    let userSubscription = repoReturnedValues[0];
    userSubscription.setSubscriptionPlanID(
      eventData["object"]["plan"]["product"]
    );
    return await this.userSubscriptionRespository.updateUserSubscriptionPlan(
      userSubscription
    );
  }

  async deleteSubscription(eventData) {
    const paymentServiceUserID = eventData["object"]["customer"];
    let repoReturnedValues =
      await this.paymentServiceUserRepository.getPaymentServiceUserByPaymentServiceUserID(
        paymentServiceUserID
      );
    if (repoReturnedValues[1] != null || !repoReturnedValues[0]) {
      return repoReturnedValues[1];
    }
    const userID = repoReturnedValues[0].getUserID();

    let error =
      await this.userSubscriptionRespository.deleteUserSubscriptionByUserID(
        userID
      );
    if (error != null) {
      console.log("failed to delete user subscription in db, error: ", error);
      return null;
    }

    error = await this.userRepository.markUserUnsubscribedByID(userID);
    if (error != null) {
      console.log("failed to mark user unsubscribed in db, error: ", error);
      return null;
    }
  }

  async updateSubscriptionCancellationAtPeriodEnd(eventData) {
    const productID = eventData["object"]["plan"]["product"];
    const subscriptionID = eventData["object"]["id"];
    const cancelAfterPeriodEnd = eventData["object"]["cancel_at_period_end"];

    // the subscription must have been updated to end after the preiod ends, no need to update it again
    // if it is not updated already, we decide below and take actions accordingly
    if (cancelAfterPeriodEnd) {
      return;
    }

    var repoReturnedValues = await this.paymentServiceAdapter.getProductDetails(
      productID
    );
    if (repoReturnedValues[1] != null) {
      console.log(
        "Unable to fetch product details, error: ",
        repoReturnedValues[1]
      );
      return;
    }
    if (!repoReturnedValues[0]) {
      console.log("Empty details received for a product with ID: ", productID);
      return;
    }

    const productDetails = repoReturnedValues[0];

    if (
      productDetails["metadata"]["type"] !=
      CommonConstants.SUBSCRIPTION_PLAN_TYPE_ONE_TIME
    ) {
      return;
    }

    repoReturnedValues =
      await this.paymentServiceAdapter.updateSubscriptionCancellationAtPeriodEnd(
        subscriptionID,
        true
      );
    if (repoReturnedValues != null) {
      console.log(
        "Unable to update subscription cancellation period, error: ",
        repoReturnedValues
      );
    }
    return;
  }
}
