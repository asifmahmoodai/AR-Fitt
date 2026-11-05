import { CommonConstants } from "../../infra/utils/common/Constants.js";
import Stripe from "stripe";

export class PaymentServiceAdapter {
  constructor(config) {
    this.config = config;
    this.stripe = new Stripe(config.PAYMENT_SERVICE_API_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }

  async getProducts() {
    const productQueryParams = {
      active: true,
      limit: 3,
    };

    return this.stripe.products
      .list(productQueryParams)
      .then((products) => {
        return [products.data, null];
      })
      .catch((error) => {
        console.log("failed to list products from stripe, error: ", error);
        return [null, error];
      });
  }

  async getProductPrices(productID) {
    const priceQueryParams = {
      product: productID,
      active: true,
      limit: 1,
    };
    return this.stripe.prices
      .list(priceQueryParams)
      .then((prices) => {
        return [prices.data, null];
      })
      .catch((error) => {
        console.log(
          "failed to list prices for a product from stripe, error: ",
          error
        );
        return [null, error];
      });
  }

  async getPriceDetails(priceID) {
    return this.stripe.prices
      .retrieve(priceID)
      .then((price) => {
        return [price, null];
      })
      .catch((error) => {
        console.log(
          "failed to fetch price information from stripe, error: ",
          error
        );
        return [null, error];
      });
  }

  async getProductDetails(productID) {
    return this.stripe.products
      .retrieve(productID)
      .then((product) => {
        return [product, null];
      })
      .catch((error) => {
        console.log(
          "failed to fetch product information from stripe, error: ",
          error
        );
        return [null, error];
      });
  }

  async createCheckoutSession(userID, priceID, params) {
    let sessionParams = {
      client_reference_id: userID,
      mode: CommonConstants.CHECKOUT_MODE_SUBSCRIPTION,
      line_items: [
        {
          price: priceID,
          quantity: 1,
        },
      ],
      success_url: this.config.PAYMENT_SERVICE_SUCCESS_URL,
      cancel_url: this.config.PAYMENT_SERVICE_CANCEL_URL,
    };
    sessionParams = { ...sessionParams, ...params };

    return this.stripe.checkout.sessions
      .create(sessionParams)
      .then((session) => {
        return [session.url, null];
      })
      .catch((error) => {
        console.log("failed to create checkout session, error: ", error);
        return [null, error];
      });
  }

  async retrieveCheckoutSession(sessionID) {
    return this.stripe.checkout.sessions
      .retrieve(sessionID)
      .then((session) => {
        return [session, null];
      })
      .catch((error) => {
        console.log("failed to retrieve checkout session, error: ", error);
        return [null, error];
      });
  }

  async verifyWebhookSignature(requestBody, signature) {
    try {
      const event = await this.stripe.webhooks.constructEventAsync(
        requestBody,
        signature,
        this.config.PAYMENT_SERVICE_WEBHOOK_API_KEY,
        undefined,
        Stripe.createSubtleCryptoProvider()
      );
      return [event.data, event.type, null];
    } catch (err) {
      console.log("webhook signature validation failed, error: ", err);
      return [null, null, err];
    }
  }

  async retrieveSubscription(subscriptionID) {
    return await this.stripe.subscriptions
      .retrieve(subscriptionID)
      .then((subscription) => {
        return [subscription, null];
      })
      .catch((error) => {
        console.log("failed to retrive subscription, error: ", error);
        return [null, error];
      });
  }

  async updateSubscription(subscriptionID, priceID, invoiceID, prorationDate) {
    try {
      await this.stripe.subscriptions.update(subscriptionID, {
        items: [{ id: invoiceID, price: priceID }],
        proration_date: prorationDate,
      });
      return null;
    } catch (error) {
      console.log("failed to update subscription, error: ", error);
      return error;
    }
  }

  async updateSubscriptionCancellationAtPeriodEnd(
    subscriptionID,
    cancelAfterPeriod
  ) {
    try {
      await this.stripe.subscriptions.update(subscriptionID, {
        cancel_at_period_end: cancelAfterPeriod,
      });
      return null;
    } catch (error) {
      console.log("failed to upate subscription cancellation period: ", error);
      return error;
    }
  }

  async cancelSubscription(subscriptionID) {
    try {
      await this.stripe.subscriptions.cancel(subscriptionID);
      return null;
    } catch (error) {
      console.log("failed to delete subscription, error: ", error);
      return error;
    }
  }
}
