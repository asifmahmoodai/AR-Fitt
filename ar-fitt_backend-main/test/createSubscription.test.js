import test from "node:test";
import assert from "node:assert/strict";
import { CreateSubscriptionUseCase } from "../usecases/payment/CreateSubscription.js";
import { PaymentController } from "../adapters/express/controllers/PaymentController.js";
import { SubscriptionValidation } from "../middleware/data_validation/SubscriptionValidation.js";
import { Headers } from "../middleware/common/headers.js";
import { Hono } from "hono";

function buildUseCase({ subscription = null, customer = null, subscribed = false, checkoutResult = ["https://checkout.stripe.com/test", null] } = {}) {
  const calls = [];
  const user = {
    getID: () => "user-1",
    getEmail: () => "member@example.com",
    getIsSubscribed: () => subscribed,
  };
  const useCase = new CreateSubscriptionUseCase(
    { getUserByEmail: async () => [user, null] },
    {
      createCheckoutSession: async (...args) => {
        calls.push(args);
        return checkoutResult;
      },
    },
    { getUserSubscriptionByUserID: async () => [subscription, null] },
    {
      getPaymentServiceUserByUserID: async () => [
        customer ? { getPaymentServiceUserID: () => customer } : null,
        null,
      ],
    }
  );
  return { useCase, calls };
}

test("new user starts checkout with email", async () => {
  const { useCase, calls } = buildUseCase();
  const response = await useCase.execute("member@example.com", "price_123");
  assert.equal(response.getStatusCode(), 201);
  assert.deepEqual(calls, [["user-1", "price_123", { customer_email: "member@example.com" }]]);
  assert.equal(response.getResponseMessage().message.checkout_session_url, "https://checkout.stripe.com/test");
});

test("renewal reuses the saved Stripe customer even if the status flag is stale", async () => {
  const { useCase, calls } = buildUseCase({ customer: "cus_123", subscribed: true });
  const response = await useCase.execute("member@example.com", "price_123");
  assert.equal(response.getStatusCode(), 201);
  assert.deepEqual(calls, [["user-1", "price_123", { customer: "cus_123" }]]);
});

test("existing subscription does not create a second checkout session", async () => {
  const { useCase, calls } = buildUseCase({ subscription: {}, customer: "cus_123", subscribed: true });
  const response = await useCase.execute("member@example.com", "price_123");
  assert.equal(response.getStatusCode(), 409);
  assert.equal(response.getResponseMessage().messageCode, "subscription_already_exists");
  assert.equal(calls.length, 0);
});

test("obsolete price IDs return a useful client error", async () => {
  const stripeError = {
    type: "StripeInvalidRequestError",
    code: "resource_missing",
    param: "line_items[0][price]",
  };
  const { useCase } = buildUseCase({ checkoutResult: [null, stripeError] });
  const response = await useCase.execute("member@example.com", "price_placeholder_monthly");
  assert.equal(response.getStatusCode(), 400);
  assert.equal(response.getResponseMessage().messageCode, "invalid_subscription_price");
});

test("POST route rejects invalid checkout input before querying the user", async () => {
  const app = new Hono();
  app.use("*", async (c, next) => {
    c.set("appContext", {});
    await next();
  });
  PaymentController.registerRoutes(app, () => ({
    commonHeaders: new Headers(),
    subscriptionValidation: new SubscriptionValidation(),
    createSubscription: () => { throw new Error("Invalid request reached checkout"); },
  }));

  const response = await app.request("/payment/createSubscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).messageCode, "invalid_data_in_request");
});
