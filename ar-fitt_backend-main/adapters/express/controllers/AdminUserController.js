import { mountExpressController } from "../../hono/expressCompat.js";
import { User } from "../../../entities/User.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

export class AdminUserController {
  constructor(prisma, adminAuthMiddleware) {
    this.prisma = prisma;
    this.adminAuthMiddleware = adminAuthMiddleware;
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: {
          created_at: "desc",
        },
      });

      const userEntities = users.map(
        (user) =>
          new User(
            user.id,
            user.email,
            user.first_name,
            user.last_name,
            user.phone,
            user.created_at,
            user.modified_at,
            user.gender,
            user.dob,
            user.is_verified,
            user.is_subscribed,
            user.is_body_scanned,
            user.is_face_scanned,
            user.role
          )
      );

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: userEntities,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "User not found",
        });
      }

      const userEntity = new User(
        user.id,
        user.email,
        user.first_name,
        user.last_name,
        user.phone,
        user.created_at,
        user.modified_at,
        user.gender,
        user.dob,
        user.is_verified,
        user.is_subscribed,
        user.is_body_scanned,
        user.is_face_scanned,
        user.role
      );

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: userEntity,
        message: "User retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, phone, gender, role } = req.body;

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          gender,
          role,
          modified_at: new Date(),
        },
      });

      const userEntity = new User(
        updatedUser.id,
        updatedUser.email,
        updatedUser.first_name,
        updatedUser.last_name,
        updatedUser.phone,
        updatedUser.created_at,
        updatedUser.modified_at,
        updatedUser.gender,
        updatedUser.dob,
        updatedUser.is_verified,
        updatedUser.is_subscribed,
        updatedUser.is_body_scanned,
        updatedUser.is_face_scanned,
        updatedUser.role
      );

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: userEntity,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return res.status(404).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "User not found",
        });
      }

      // Delete user
      await this.prisma.user.delete({
        where: { id },
      });

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  static registerRoutes(app, buildController) {
    const router = mountExpressController(app, buildController);

    router.get(
      "/admin/users",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.getAllUsers(req, res)
    );

    router.get(
      "/admin/users/:id",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.getUserById(req, res)
    );

    router.put(
      "/admin/users/:id",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.updateUser(req, res)
    );

    router.delete(
      "/admin/users/:id",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.deleteUser(req, res)
    );
  }
}
