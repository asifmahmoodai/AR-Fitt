import { PaymentServiceUser } from "../../../entities/PaymentServiceUser.js";

export class PaymentServiceUserRespository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createPaymentServiceUser(paymentServiceUser) {
    try {
      await this.prisma.payment_service_user.create({
        data: {
          user_id: paymentServiceUser.getUserID(),
          payment_service_user_id: paymentServiceUser.getPaymentServiceUserID(),
          created_at: paymentServiceUser.getCreatedAt(),
          modified_at: paymentServiceUser.getModifiedAt(),
        },
      });
    } catch (error) {
      console.log(
        "failed to create user payment service in db, error: ",
        error
      );
      return error;
    }
    return null;
  }

  async getPaymentServiceUserByUserID(userID) {
    try {
      // Validate userID before querying
      if (!userID || typeof userID !== 'string' || userID.trim() === '') {
        console.log(
          "Invalid userID provided to getPaymentServiceUserByUserID: ",
          userID
        );
        return [null, new Error("Invalid userID: userID must be a non-empty string")];
      }

      const result = await this.prisma.payment_service_user.findUnique({
        where: {
          user_id: userID,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new PaymentServiceUser(
          result.user_id,
          result.payment_service_user_id,
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log(
        "failed to read user payment service from db, error: ",
        error
      );
      console.log("Error details:", {
        message: error.message,
        code: error.code,
        meta: error.meta,
        userID: userID
      });
      return [null, error];
    }
  }

  async getPaymentServiceUserByPaymentServiceUserID(userID) {
    try {
      const result = await this.prisma.payment_service_user.findFirst({
        where: {
          payment_service_user_id: userID,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new PaymentServiceUser(
          result.user_id,
          result.payment_service_user_id,
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log(
        "failed to read user payment service from db, error: ",
        error
      );
      return [null, error];
    }
  }
}
