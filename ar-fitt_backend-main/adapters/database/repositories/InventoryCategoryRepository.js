import { InventoryCategory } from "../../../entities/InventoryCategory.js";

export class InventoryCategoryRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }


  async getUserGender(userId) {
    try {
      if (!userId) return null;

      // Guest users are also rows in the `user` table (see RegisterGuestUser),
      // so a single lookup covers both registered and guest users.
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { gender: true }
      });
      return user?.gender ? user.gender.toLowerCase() : null;
    } catch (error) {
      console.log("failed to get user gender:", error);
      return null;
    }
  }

  async getAllInventoryCategories(type, userId = null) {
    try {
      // Get user gender for filtering
      const userGender = await this.getUserGender(userId);
      console.log(`[getAllInventoryCategories] Type: ${type}, UserId: ${userId}, UserGender: ${userGender}`);
      
      // Build query based on whether we have user gender
      // Only return categories that have at least 1 product matching the gender criteria
      let result;
      
      if (userGender) {
        // Filter: show products where gender is null/empty OR matches user gender
        result = await this.prisma.$queryRaw`
          SELECT 
            ic.id, 
            ic.name, 
            ic.description, 
            ic.type, 
            ic.created_at, 
            ic.modified_at,
            (SELECT COUNT(*) FROM inventory_item ii 
             WHERE ii.category_id = ic.id 
             AND (ii.gender IS NULL OR ii.gender = '' OR LOWER(ii.gender) = ${userGender})
            ) as product_count
          FROM inventory_category ic
          WHERE ic.type = ${type}
          AND (SELECT COUNT(*) FROM inventory_item ii 
               WHERE ii.category_id = ic.id 
               AND (ii.gender IS NULL OR ii.gender = '' OR LOWER(ii.gender) = ${userGender})
              ) > 0
          ORDER BY ic.name ASC
        `;
      } else {
        // No gender filter, just check for products
        result = await this.prisma.$queryRaw`
          SELECT 
            ic.id, 
            ic.name, 
            ic.description, 
            ic.type, 
            ic.created_at, 
            ic.modified_at,
            (SELECT COUNT(*) FROM inventory_item ii WHERE ii.category_id = ic.id) as product_count
          FROM inventory_category ic
          WHERE ic.type = ${type}
          AND (SELECT COUNT(*) FROM inventory_item ii WHERE ii.category_id = ic.id) > 0
          ORDER BY ic.name ASC
        `;
      }
      
      console.log(`[getAllInventoryCategories] Found ${result?.length || 0} categories with matching products`);
      result?.forEach(cat => console.log(`  - ${cat.name}: ${cat.product_count} products`));
      
      if (!result || result.length === 0) {
        return [null, null];
      }
      var inventoryCategories = [];
      result.forEach(function (value) {
        inventoryCategories.push(
          new InventoryCategory(
            value.id,
            value.name,
            value.description,
            value.type,
            value.created_at,
            value.modified_at
          )
        );
      });
      return [inventoryCategories, null];
    } catch (error) {
      console.log(
        "failed to read inventory categories from db, error: ",
        error
      );
      return [null, error];
    }
  }

  async getInventoryCategory(categoryID) {
    try {
      const result = await this.prisma.inventory_category.findUnique({
        where: {
          id: categoryID,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new InventoryCategory(
          result.id,
          result.name,
          result.description,
          result.type,
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log("failed to read inventory category from db, error: ", error);
      return [null, error];
    }
  }

  async getAllDemoInventoryCategories(type) {
    try {
      // Only return demo categories that have at least 1 product
      const result =
        await this.prisma.$queryRaw`select ic.id, ic."name", ic.description, ic."type", ic.created_at, ic.modified_at 
      from inventory_category ic 
      inner join inventory_demo_category idc on ic.id = idc.category_id 
      where idc.is_demo_item = true and ic."type" = ${type}
      and exists (select 1 from inventory_item ii where ii.category_id = ic.id);`;
      if (!result) {
        return [null, null];
      }
      var inventoryCategories = [];
      result.forEach(function (value) {
        inventoryCategories.push(
          new InventoryCategory(
            value.id,
            value.name,
            value.description,
            value.type,
            value.created_at,
            value.modified_at
          )
        );
      });
      return [inventoryCategories, null];
    } catch (error) {
      console.log(
        "failed to read demo inventory categories from db, error: ",
        error
      );
      return [null, error];
    }
  }
}
