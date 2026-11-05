import { UserBodyMatrix } from "../../../entities/UserBodyMatrix.js";

export class UserBodyMatrixRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUserBodyMatrix(userBodyMatrix) {
    try {
      await this.prisma.user_body_matrix.create({
        data: {
          user_id: userBodyMatrix.getUserID(),
          body_matrix: userBodyMatrix.getBodyMatrix(),
          created_at: userBodyMatrix.getCreatedAt(),
          modified_at: userBodyMatrix.getModifiedAt(),
        },
      });
      return null;
    } catch (error) {
      console.log("failed to create user body matrix in db, error: ", error);
      return error;
    }
  }

  async updateUserBodyMatrix(userBodyMatrix) {
    try {
      await this.prisma.user_body_matrix.update({
        where: { user_id: userBodyMatrix.getUserID() },
        data: {
          body_matrix: userBodyMatrix.getBodyMatrix(),
          modified_at: userBodyMatrix.getModifiedAt(),
        },
      });
      return null;
    } catch (error) {
      console.log("failed to update user body matrix in db, error: ", error);
      return error;
    }
  }

  async deleteUserBodyMatrix(userID) {
    try {
      await this.prisma.user_body_matrix.delete({
        where: { user_id: userID },
      });
      return null;
    } catch (error) {
      console.log("failed to delete user body matrix in db, error: ", error);
      return error;
    }
  }

  async getUserBodyMatrixByUserID(userID) {
    try {
      const result = await this.prisma.user_body_matrix.findUnique({
        where: {
          user_id: userID,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new UserBodyMatrix(
          result.user_id,
          result.body_matrix,
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log("failed to get user body matrix from db, error: ", error);
      return [null, error];
    }
  }
}
