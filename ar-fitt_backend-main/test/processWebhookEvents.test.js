import test from "node:test";
import assert from "node:assert/strict";
import { ProcessWebhookEventsUseCase } from "../usecases/payment/ProcessWebhookEvents.js";

test("invalid Stripe signatures return 400 without processing an event", async () => {
  const useCase = new ProcessWebhookEventsUseCase(
    {},
    { verifyWebhookSignature: async () => [null, null, new Error("Invalid signature")] },
    {},
    {}
  );
  const response = await useCase.execute("{}", "bad-signature");
  assert.equal(response.getStatusCode(), 400);
});
