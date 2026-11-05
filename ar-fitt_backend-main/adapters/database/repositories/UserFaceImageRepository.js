import util from "util";
import { UserFaceImage } from "../../../entities/UserFaceImage.js";
import { UserFaceImageURL } from "../../../entities/UserFaceImageURL.js";

export class UserFaceImageRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUserFaceImage(userFaceImage) {
    try {
      await this.prisma.user_face_image.create({
        data: {
          user_id: userFaceImage.getUserID(),
          face_image: userFaceImage.getFaceImage(),
          created_at: userFaceImage.getCreatedAt(),
          modified_at: userFaceImage.getModifiedAt(),
        },
      });
      return null;
    } catch (error) {
      console.log("failed to create user face image in db, error: ", error);
      return error;
    }
  }

  async updateUserFaceImage(userFaceImage) {
    try {
      await this.prisma.user_face_image.update({
        where: { user_id: userFaceImage.getUserID() },
        data: {
          face_image: userFaceImage.getFaceImage(),
          modified_at: userFaceImage.getModifiedAt(),
        },
      });
      return null;
    } catch (error) {
      console.log("failed to update user face image in db, error: ", error);
      return error;
    }
  }

  async deleteUserFaceImage(userID) {
    try {
      await this.prisma.user_face_image.delete({
        where: { user_id: userID },
      });
      return null;
    } catch (error) {
      console.log("failed to delete user face image in db, error: ", error);
      return error;
    }
  }

  async getUserFaceImageByUserID(userID) {
    try {
      const result = await this.prisma.user_face_image.findUnique({
        where: {
          user_id: userID,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new UserFaceImage(
          result.user_id,
          result.face_image,
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log("failed to get user face image from db, error: ", error);
      return [null, error];
    }
  }

  async getUserFaceImageURLByUserID(userID) {
    try {
      const result = await this.prisma.user_face_image.findUnique({
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
        new UserFaceImageURL(
          result.user_id,
          util.format("/faceImage/%s", result.user_id),
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
