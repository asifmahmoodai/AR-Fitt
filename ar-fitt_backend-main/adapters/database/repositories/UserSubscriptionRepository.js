import { UserSubscription } from "../../../entities/UserSubscription.js";

export class UserSubscriptionRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUserSubscription(userSubscription) {
    try {
      await this.prisma.user_subscription.create({
        data: {
          user_id: userSubscription.getUserID(),
          subscription_plan_id: userSubscription.getSubscriptionPlanID(),
          subscription_id: userSubscription.getSubscriptionID(),
          created_at: userSubscription.getCreatedAt(),
          modified_at: userSubscription.getModifiedAt(),
        },
      });
    } catch (error) {
      console.log("failed to create user subscription into db, error: ", error);
      return error;
    }
    return null;
  }

  async getUserSubscriptionByUserID(userID) {
    try {
      const result = await this.prisma.user_subscription.findUnique({
        where: {
          user_id: userID,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new UserSubscription(
          result.user_id,
          result.subscription_plan_id,
          result.subscription_id,
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log("failed to read user subscription from db, error: ", error);
      return [null, error];
    }
  }

  async updateUserSubscriptionPlan(userSubscription) {
    try {
      await this.prisma.user_subscription.update({
        where: {
          user_id: userSubscription.getUserID(),
        },
        data: {
          subscription_plan_id: userSubscription.getSubscriptionPlanID(),
        },
      });
      return null;
    } catch (error) {
      console.log("failed to update user subscription in db, error: ", error);
      return null;
    }
  }

  async deleteUserSubscriptionByUserID(userID) {
    try {
      await this.prisma.user_subscription.delete({
        where: {
          user_id: userID,
        },
      });
      return null;
    } catch (error) {
      console.log("failed to delete user subscription in db, error: ", error);
      return error;
    }
  }
}
