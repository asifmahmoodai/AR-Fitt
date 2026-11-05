import { v4 as uuidv4 } from "uuid";
import { mountExpressController } from "../../hono/expressCompat.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

const ALLOWED_IMAGE_EXTENSIONS = /jpeg|jpg|png|gif|webp/;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, matches the old multer limit

const PRODUCT_INCLUDE = {
  category: {
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
    },
  },
  colors: true,
  sizes: true,
  // Deliberately NOT including the `images` relation (inventory_item_image,
  // a raw-Bytes column) here: it's legacy/vestigial demo data unrelated to
  // the live upload flow (which stores files via imageUrls instead), and
  // JSON-serializing that much binary data can throw "RangeError: Invalid
  // string length" once there's enough seeded image data.
  imageUrls: true,
};

function fileExtension(filename) {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx).toLowerCase();
}

export class AdminProductController {
  constructor(prisma, adminAuthMiddleware, productImagesBucket) {
    this.prisma = prisma;
    this.adminAuthMiddleware = adminAuthMiddleware;
    this.productImagesBucket = productImagesBucket;
  }

  // Get all products with category information
  async getAllProducts(req, res) {
    try {
      const products = await this.prisma.inventory_item.findMany({
        include: PRODUCT_INCLUDE,
        orderBy: {
          id: "asc",
        },
      });

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: products,
        message: "Products retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Get product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.prisma.inventory_item.findUnique({
        where: { id },
        include: PRODUCT_INCLUDE,
      });

      if (!product) {
        return res.status(404).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Product not found",
        });
      }

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: product,
        message: "Product retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Create new product
  async createProduct(req, res) {
    try {
      const { categoryId, name, brand, price, currency, description, lensId, colors, sizes, imageUrls, gender } =
        req.body;

      // Create the product
      const newProduct = await this.prisma.inventory_item.create({
        data: {
          id: uuidv4(),
          category_id: categoryId,
          name,
          brand,
          price,
          currency,
          description,
          lens_id: lensId,
          gender: gender || null,
        },
      });

      // Add colors if provided
      if (colors && colors.length > 0) {
        await this.prisma.inventory_item_color.createMany({
          data: colors.map((color) => ({
            id: uuidv4(),
            item_id: newProduct.id,
            color: color.color,
            color_hex: color.colorHex,
          })),
        });
      }

      // Add sizes if provided
      if (sizes && sizes.length > 0) {
        await this.prisma.inventory_item_size.createMany({
          data: sizes.map((size) => ({
            id: uuidv4(),
            item_id: newProduct.id,
            size,
          })),
        });
      }

      // Add image URLs if provided
      if (imageUrls && imageUrls.length > 0) {
        await this.prisma.inventory_item_image_url.createMany({
          data: imageUrls.map((url) => ({
            id: uuidv4(),
            item_id: newProduct.id,
            image_url: url,
          })),
        });
      }

      // Fetch the complete product with relations
      const completeProduct = await this.prisma.inventory_item.findUnique({
        where: { id: newProduct.id },
        include: PRODUCT_INCLUDE,
      });

      res.status(201).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: completeProduct,
        message: "Product created successfully",
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Update product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { categoryId, name, brand, price, currency, description, lensId, colors, sizes, imageUrls, gender } =
        req.body;

      // Update the product
      await this.prisma.inventory_item.update({
        where: { id },
        data: {
          category_id: categoryId,
          name,
          brand,
          price,
          currency,
          description,
          lens_id: lensId,
          gender: gender || null,
        },
      });

      // Update colors if provided
      if (colors) {
        // Delete existing colors
        await this.prisma.inventory_item_color.deleteMany({
          where: { item_id: id },
        });

        // Add new colors
        if (colors.length > 0) {
          await this.prisma.inventory_item_color.createMany({
            data: colors.map((color) => ({
              id: uuidv4(),
              item_id: id,
              color: color.color,
              color_hex: color.colorHex,
            })),
          });
        }
      }

      // Update sizes if provided
      if (sizes) {
        // Delete existing sizes
        await this.prisma.inventory_item_size.deleteMany({
          where: { item_id: id },
        });

        // Add new sizes
        if (sizes.length > 0) {
          await this.prisma.inventory_item_size.createMany({
            data: sizes.map((size) => ({
              id: uuidv4(),
              item_id: id,
              size,
            })),
          });
        }
      }

      // Update image URLs if provided
      if (imageUrls) {
        // Delete existing image URLs
        await this.prisma.inventory_item_image_url.deleteMany({
          where: { item_id: id },
        });

        // Add new image URLs
        if (imageUrls.length > 0) {
          await this.prisma.inventory_item_image_url.createMany({
            data: imageUrls.map((url) => ({
              id: uuidv4(),
              item_id: id,
              image_url: url,
            })),
          });
        }
      }

      // Fetch the complete updated product
      const completeProduct = await this.prisma.inventory_item.findUnique({
        where: { id },
        include: PRODUCT_INCLUDE,
      });

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: completeProduct,
        message: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Delete product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      // Check if product exists
      const existingProduct = await this.prisma.inventory_item.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return res.status(404).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Product not found",
        });
      }

      // Delete related records first
      await this.prisma.inventory_item_color.deleteMany({
        where: { item_id: id },
      });

      await this.prisma.inventory_item_size.deleteMany({
        where: { item_id: id },
      });

      await this.prisma.inventory_item_image_url.deleteMany({
        where: { item_id: id },
      });

      await this.prisma.inventory_item_image.deleteMany({
        where: { item_id: id },
      });

      // Delete the product
      await this.prisma.inventory_item.delete({
        where: { id },
      });

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Upload product image — reads the raw multipart body itself (route is
  // registered with { skipBodyParse: true }) and stores the file in the R2
  // product-images bucket instead of the local `product_images/` disk directory.
  async uploadProductImage(req, res) {
    try {
      const { id } = req.params;

      const formData = await req.raw.formData();
      const file = formData.get("image");

      if (!file || typeof file === "string") {
        return res.status(400).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "No image file provided",
        });
      }

      const extension = fileExtension(file.name || "");
      const extnameOk = ALLOWED_IMAGE_EXTENSIONS.test(extension);
      const mimetypeOk = ALLOWED_IMAGE_EXTENSIONS.test(file.type || "");

      if (!extnameOk || !mimetypeOk) {
        return res.status(400).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Only image files are allowed!",
        });
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return res.status(400).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Image exceeds the 5MB size limit",
        });
      }

      // Check if product exists
      const product = await this.prisma.inventory_item.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Product not found",
        });
      }

      // Delete existing image if any
      const existingImage = await this.prisma.inventory_item_image_url.findFirst({
        where: { item_id: id },
      });

      if (existingImage) {
        await this.productImagesBucket.delete(existingImage.image_url);

        // Delete the database record
        await this.prisma.inventory_item_image_url.delete({
          where: { id: existingImage.id },
        });
      }

      // Generate a unique R2 object key (mirrors the old unique-filename scheme)
      const objectKey = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
      const fileBytes = await file.arrayBuffer();
      await this.productImagesBucket.put(objectKey, fileBytes, {
        httpMetadata: { contentType: file.type },
      });

      // Create new image record — stores the bare R2 object key (see
      // GET /product_images/:key below for how it's resolved back to bytes)
      const newImage = await this.prisma.inventory_item_image_url.create({
        data: {
          id: uuidv4(),
          item_id: id,
          image_url: objectKey,
        },
      });

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        data: newImage,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Delete product image
  async deleteProductImage(req, res) {
    try {
      const { id } = req.params;

      // Find the image record
      const imageRecord = await this.prisma.inventory_item_image_url.findFirst({
        where: { item_id: id },
      });

      if (!imageRecord) {
        return res.status(404).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Image not found",
        });
      }

      // Delete the object from R2
      await this.productImagesBucket.delete(imageRecord.image_url);

      // Delete the database record
      await this.prisma.inventory_item_image_url.delete({
        where: { id: imageRecord.id },
      });

      res.status(200).json({
        status: CommonConstants.SUCCESS_STATUS,
        message: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({
        status: CommonConstants.FAILURE_STATUS,
        message: "Internal server error",
      });
    }
  }

  // Serves a product image straight out of R2 by its object key. This replaces
  // the old `app.use('/product_images', express.static('product_images'))` line
  // in server.js (Workers has no local disk to serve from). Left unauthenticated
  // to match the old static-file route, which was also publicly reachable.
  async serveProductImage(req, res) {
    try {
      const { key } = req.params;
      const object = await this.productImagesBucket.get(key);

      if (!object) {
        return res.status(404).json({
          status: CommonConstants.FAILURE_STATUS,
          message: "Image not found",
        });
      }

      res.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
      res.status(200).end(object.body);
    } catch (error) {
      console.error("Error serving product image:", error);
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
      "/admin/products",
      // (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.getAllProducts(req, res)
    );

    router.get(
      "/admin/products/:id",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.getProductById(req, res)
    );

    router.post(
      "/admin/products",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.createProduct(req, res)
    );

    router.put(
      "/admin/products/:id",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.updateProduct(req, res)
    );

    router.delete(
      "/admin/products/:id",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.deleteProduct(req, res)
    );

    // Multipart body — parsed manually via req.raw.formData() in uploadProductImage.
    router.post(
      "/admin/products/:id/image",
      { skipBodyParse: true },
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.uploadProductImage(req, res)
    );

    router.delete(
      "/admin/products/:id/image",
      (c, req, res, next) => c.adminAuthMiddleware.verifyAdminToken(req, res, next),
      (c, req, res) => c.deleteProductImage(req, res)
    );

    router.get("/product_images/:key", (c, req, res) => c.serveProductImage(req, res));
  }
}
