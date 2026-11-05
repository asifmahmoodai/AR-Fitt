import { UserCredential } from "../../../entities/UserCredential.js";

export class UserCredentialRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUserCredential(userCredential) {
    try {
      await this.prisma.user_credential.create({
        data: {
          user_email: userCredential.getEmail(),
          password_hash: userCredential.getPasswordHash(),
          created_at: userCredential.getCreatedAt(),
          modified_at: userCredential.getModifiedAt(),
        },
      });
    } catch (error) {
      console.log("failed to save user credentials into db, error: ", error);
      return error;
    }
    return null;
  }

  async getUserCredentialByEmail(userEmail) {
    try {
      const result = await this.prisma.user_credential.findUnique({
        where: {
          user_email: userEmail,
        },
      });

      if (!result) {
        return [null, null];
      }
      return [
        new UserCredential(
          result.user_email,
          result.password_hash,
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log("failed to read user credential from db, error: ", error);
      return [null, error];
    }
  }

  async updateUserCredential(userCredential) {
    try {
      await this.prisma.user_credential.update({
        where: {
          user_email: userCredential.getEmail(),
        },
        data: {
          password_hash: userCredential.getPasswordHash(),
          modified_at: userCredential.getModifiedAt(),
        },
      });
    } catch (error) {
      console.log("failed to update user credential into db, error: ", error);
      return error;
    }
    return null;
  }
}
