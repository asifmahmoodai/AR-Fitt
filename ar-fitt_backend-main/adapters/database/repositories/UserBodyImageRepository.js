import util from "util";
import { UserBodyImage } from "../../../entities/UserBodyImage.js";
import { UserBodyImageURL } from "../../../entities/UserBodyImageURL.js";

export class UserBodyImageRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUserBodyImage(userBodyImage) {
    console.log("userBodyImage", userBodyImage);
    try {

      console.log("CreateUserBodyRepo.js");
      console.log("Get Size", userBodyImage.getRecommendedSize());

      await this.prisma.user_body_image.create({
        data: {
          user_id: userBodyImage.getUserID(),
          body_image: userBodyImage.getBodyImage(),
          recommended_size: userBodyImage.getRecommendedSize(),
          recommended_colors: userBodyImage.getRecommendedColors(),
          recommended_shirts: userBodyImage.getRecommendedShirts(),
          // created_at: userBodyImage.getCreatedAt(),
          // modified_at: userBodyImage.getModifiedAt(),
        },
      });
      return null;
    } catch (error) {
      console.log("failed to create user body image in db, error: ", error);
      return error;
    }
  }

  async updateUserBodyImage(userBodyImage) {
    try {
      await this.prisma.user_body_image.update({
        where: { user_id: userBodyImage.getUserID() },
        data: {
          body_image: userBodyImage.getBodyImage(),
          modified_at: userBodyImage.getModifiedAt(),
        },
      });
      return null;
    } catch (error) {
      console.log("failed to update user body image in db, error: ", error);
      return error;
    }
  }

  async deleteUserBodyImage(userID) {
    try {
      await this.prisma.user_body_image.delete({
        where: { user_id: userID },
      });
      return null;
    } catch (error) {
      console.log("failed to delete user body image in db, error: ", error);
      return error;
    }
  }

  async getUserBodyImageByUserID(userID) {
    try {
      const result = await this.prisma.user_body_image.findUnique({
        where: {
          user_id: userID,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new UserBodyImage(
          result.user_id,
          result.body_image,
          result.recommended_shirts,
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log("failed to get user body image from db, error: ", error);
      return [null, error];
    }
  }

  async getUserBodyImageURLByUserID(userID) {
    try {
      const result = await this.prisma.user_body_image.findUnique({
        where: {
          user_id: userID,
        },
        select: {
          user_id: true,
          created_at: true,
          modified_at: true,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new UserBodyImageURL(
          result.user_id,
          util.format("/bodyImage/%s", result.user_id),
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log("failed to get user body image url from db, error: ", error);
      return [null, error];
    }
  }
}
