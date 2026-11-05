import { User } from "../../../entities/User.js";

export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUser(user) {
    try {
      await this.prisma.user.create({
        data: {
          id: user.getID(),
          email: user.getEmail(),
          first_name: user.getFirstName(),
          last_name: user.getLastName(),
          phone: user.getPhone(),
          created_at: user.getCreatedAt(),
          modified_at: user.getModifiedAt(),
          gender: user.getGender(),
          dob: user.getDOB(),
          is_verified: user.getIsVerified(),
          is_subscribed: user.getIsSubscribed(),
          is_body_scanned: user.getIsBodyScanned(),
          is_face_scanned: user.getIsFaceScanned(),
          role: user.getRole(),
        },
      });
    } catch (error) {
      console.log("failed to create user into db, error: ", error);
      return error;
    }
    return null;
  }

  async getUserByEmail(userEmail) {
    try {
      const result = await this.prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (!result) {
        return [null, null];
      }

      const imageRecord = await this.prisma.user_body_image.findUnique({
        where: { user_id: result.id },
      });
      const recommendedSize = imageRecord ? imageRecord.recommended_size : null;
      return [
        new User(
          result.id,
          result.email,
          result.first_name,
          result.last_name,
          result.phone,
          result.created_at,
          result.modified_at,
          result.gender,
          result.dob,
          result.is_verified,
          result.is_subscribed,
          result.is_body_scanned,
          result.is_face_scanned,
          result.role
        ),
        null,
        recommendedSize
      ];
    } catch (error) {
      console.log("failed to read user from db, error: ", error);
      return [null, error];
    }
  }

  async markUserVerified(userEmail) {
    try {
      await this.prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          is_verified: true,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user verification status in db, error: ",
        error
      );
      return error;
    }
  }

  async markeUserSubscribed(userEmail) {
    try {
      await this.prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          is_subscribed: true,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user subscription status in db, error: ",
        error
      );
      return error;
    }
  }

  async markUserUnsubscribedByID(userID) {
    try {
      await this.prisma.user.update({
        where: {
          id: userID,
        },
        data: {
          is_subscribed: false,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user subscription status in db, error: ",
        error
      );
      return error;
    }
  }

  async markUserUnsubscribedByEmail(userEmail) {
    try {
      await this.prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          is_subscribed: false,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user subscription status in db, error: ",
        error
      );
      return error;
    }
  }

  async updateUserByEmail(updatedUser) {
    let payload = {};
    if (updatedUser.getFirstName()) {
      payload["first_name"] = updatedUser.getFirstName();
    }
    if (updatedUser.getLastName()) {
      payload["last_name"] = updatedUser.getLastName();
    }
    if (updatedUser.getPhone()) {
      payload["phone"] = updatedUser.getPhone();
    }
    if (updatedUser.getGender()) {
      payload["gender"] = updatedUser.getGender();
    }
    if (updatedUser.getDOB()) {
      payload["dob"] = new Date(updatedUser.getDOB());
    }
    payload["modified_at"] = updatedUser.getModifiedAt();

    try {
      await this.prisma.user.update({
        where: {
          email: updatedUser.getEmail(),
        },
        data: { ...payload },
      });
      return null;
    } catch (error) {
      console.log("failed to update user in db, error: ", error);
      return error;
    }
  }

  async markUserBodyScannedByEmail(userEmail) {
    try {
      await this.prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          is_body_scanned: true,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user body scanned status in db, error: ",
        error
      );
      return error;
    }
  }

  async markUserBodyUnScannedByEmail(userEmail) {
    try {
      await this.prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          is_body_scanned: false,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user body scanned status in db, error: ",
        error
      );
      return error;
    }
  }

  async markUserFaceScannedByEmail(userEmail) {
    try {
      await this.prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          is_face_scanned: true,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user face scanned status in db, error: ",
        error
      );
      return error;
    }
  }

  async markUserFaceUnScannedByEmail(userEmail) {
    try {
      await this.prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          is_face_scanned: false,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user face scanned status in db, error: ",
        error
      );
      return error;
    }
  }

  async getUserByID(userID) {
    try {
      const result = await this.prisma.user.findUnique({
        where: {
          id: userID,
        },
      });

      if (!result) {
        return [null, null];
      }
      return [
        new User(
          result.id,
          result.email,
          result.first_name,
          result.last_name,
          result.phone,
          result.created_at,
          result.modified_at,
          result.gender,
          result.dob,
          result.is_verified,
          result.is_subscribed,
          result.is_body_scanned,
          result.is_face_scanned,
          result.role
        ),
        null,
      ];
    } catch (error) {
      console.log("failed to read user from db, error: ", error);
      return [null, error];
    }
  }

  async markUserBodyScannedByID(userID) {
    try {
      await this.prisma.user.update({
        where: {
          id: userID,
        },
        data: {
          is_body_scanned: true,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user body scanned status in db, error: ",
        error
      );
      return error;
    }
  }

  async markUserBodyUnScannedByID(userID) {
    try {
      await this.prisma.user.update({
        where: {
          id: userID,
        },
        data: {
          is_body_scanned: false,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user body scanned status in db, error: ",
        error
      );
      return error;
    }
  }

  async markUserFaceScannedByID(userID) {
    try {
      await this.prisma.user.update({
        where: {
          id: userID,
        },
        data: {
          is_face_scanned: true,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user face scanned status in db, error: ",
        error
      );
      return error;
    }
  }

  async markUserFaceUnScannedByID(userID) {
    try {
      await this.prisma.user.update({
        where: {
          id: userID,
        },
        data: {
          is_face_scanned: false,
        },
      });
      return null;
    } catch (error) {
      console.log(
        "failed to update user face scanned status in db, error: ",
        error
      );
      return error;
    }
  }
}
