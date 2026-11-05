import { v4 as uuidv4 } from "uuid";
import { mountExpressController } from "../../hono/expressCompat.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

export class AdminCategoryController {
  constructor(prisma, adminAuthMiddleware) {
    this.prisma = prisma;
    this.adminAuthMiddleware = adminAuthMiddleware;
  }

  // Get all categories
  async getAllCategories(req, res) {
    try {
      const categories = await this.prisma.inventory_category.findMany({
        orderBy: {
          created_at: "desc",
        },
      });

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: categories,
        message: "Categories retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Get category by ID
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await this.prisma.inventory_category.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Category not found",
        });
      }

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: category,
        message: "Category retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Create new category
  async createCategory(req, res) {
    try {
      const { name, description, type } = req.body;

      const newCategory = await this.prisma.inventory_category.create({
        data: {
          id: uuidv4(),
          name,
          description,
          type,
          created_at: new Date(),
          modified_at: new Date(),
        },
      });

      res.status(201).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: newCategory,
        message: "Category created successfully",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Update category
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description, type } = req.body;

      const updatedCategory = await this.prisma.inventory_category.update({
        where: { id },
        data: {
          name,
          description,
          type,
          modified_at: new Date(),
        },
      });

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: updatedCategory,
        message: "Category updated successfully",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Delete category (cascades to delete all products and related data)
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      // Check if category exists
      const existingCategory = await this.prisma.inventory_category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        return res.status(404).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Category not found",
        });
      }

      // Get all products in this category
      const productsInCategory = await this.prisma.inventory_item.findMany({
        where: { category_id: id },
        select: { id: true },
      });

      const productIds = productsInCategory.map((p) => p.id);

      // Delete all related product data if there are products
      if (productIds.length > 0) {
        // Delete product colors
        await this.prisma.inventory_item_color.deleteMany({
          where: { item_id: { in: productIds } },
        });

        // Delete product sizes
        await this.prisma.inventory_item_size.deleteMany({
          where: { item_id: { in: productIds } },
        });

        // Delete product images (binary)
        await this.prisma.inventory_item_image.deleteMany({
          where: { item_id: { in: productIds } },
        });

        // Delete product image URLs
        await this.prisma.inventory_item_image_url.deleteMany({
          where: { item_id: { in: productIds } },
        });

        // Delete demo item records
        await this.prisma.inventory_demo_item.deleteMany({
          where: { item_id: { in: productIds } },
        });

        // Delete all products in this category
        await this.prisma.inventory_item.deleteMany({
          where: { category_id: id },
        });
      }

      // Delete related demo category record if exists
      await this.prisma.inventory_demo_category.deleteMany({
        where: { category_id: id },
      });

      // Delete the category
      await this.prisma.inventory_category.delete({
        where: { id },
      });

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        message: "Category and all associated products deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  static registerRoutes(app, buildController) {
    const router = mountExpressController(app, buildController);

    // NOTE: admin-token auth is intentionally disabled on this route in the
    // original Express code too (left commented out there) — preserved as-is.
    router.get(
      "/admin/categories",
      // (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.getAllCategories(req, res)
    );

    router.get(
      "/admin/categories/:id",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.getCategoryById(req, res)
    );

    router.post(
      "/admin/categories",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.createCategory(req, res)
    );

    router.put(
      "/admin/categories/:id",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.updateCategory(req, res)
    );

    router.delete(
      "/admin/categories/:id",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.deleteCategory(req, res)
    );
  }
}
