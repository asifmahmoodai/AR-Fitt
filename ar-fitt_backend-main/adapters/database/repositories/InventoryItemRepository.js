import { InventoryItem } from "../../../entities/InventoryItem.js";
import { UserBodyImage } from "../../../entities/UserBodyImage.js";


export class InventoryItemRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }


  async getUserGenderByID(userID) {
    try {
      // Guest users are also rows in the `user` table (see RegisterGuestUser),
      // so a single lookup covers both registered and guest users.
      const user = await this.prisma.user.findUnique({
        where: { id: userID },
        select: { gender: true }
      });
      return [user ? user.gender : null, null];
    } catch (error) {
      console.log("failed to get user gender from db, error: ", error);
      return [null, error];
    }
  }

  async getUserBodyImageByUserID(userID) {
    console.log("ReportItem", userID);
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
            result.recommended_size,
            result.recommended_colors,
            result.recommended_shirts,
          ),
          null,
        ];
      } catch (error) {
        console.log("failed to get user body image from db, error: ", error);
        return [null, error];
      }
    }

  async getAllInventoryItems(categoryID, userGender = null) {
    try {
      // Build where clause with gender filtering
      // Show products where: gender is null/empty (any) OR gender matches user's gender
      let whereClause = {
        category_id: categoryID,
      };
      
      if (userGender) {
        whereClause.OR = [
          { gender: null },
          { gender: '' },
          { gender: userGender.toLowerCase() }
        ];
      }
      
      const result = await this.prisma.inventory_item.findMany({
        where: whereClause,
      });
      
      console.log(`[getAllInventoryItems] Category: ${categoryID}, UserGender: ${userGender}, Found: ${result?.length || 0} items`);
      
      if (!result) {
        return [null, null];
      }
      var inventoryItems = [];
      result.forEach(function (value) {
        inventoryItems.push(
          new InventoryItem(
            value.id,
            value.category_id,
            value.name,
            value.brand,
            value.price,
            value.currency,
            value.description,
            value.created_at,
            value.modified_at,
            value.lens_id,
            value.gender
          )
        );
      });
      return [inventoryItems, null];
    } catch (error) {
      console.log("failed to read inventory items from db, error: ", error);
      return [null, error];
    }
  }

  async getInventoryItem(itemID) {
    try {
      const result = await this.prisma.inventory_item.findUnique({
        where: {
          id: itemID,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new InventoryItem(
          result.id,
          result.category_id,
          result.name,
          result.brand,
          result.price,
          result.currency,
          result.description,
          result.created_at,
          result.modified_at,
          result.lens_id,
          result.gender
        ),
        null,
      ];
    } catch (error) {
      console.log(
        "failed to read inventory item details from db, error: ",
        error
      );
      return [null, error];
    }
  }

  async getAllDemoInventoryItems(categoryID) {
    try {
      const result =
        await this.prisma.$queryRaw`select ii.id, ii.category_id, ii."name", ii.brand, ii.price, ii.currency, ii.description, ii.lens_id, ii.gender, ii.created_at, 
	    ii.modified_at from inventory_item ii 
	    inner join inventory_demo_item idi on idi.item_id = ii.id where idi.is_demo_item = true and ii.category_id = ${categoryID};`;
      if (!result) {
        return [null, null];
      }
      var inventoryItems = [];
      result.forEach(function (value) {
        inventoryItems.push(
          new InventoryItem(
            value.id,
            value.category_id,
            value.name,
            value.brand,
            value.price,
            value.currency,
            value.description,
            value.created_at,
            value.modified_at,
            value.lens_id,
            value.gender
          )
        );
      });
      return [inventoryItems, null];
    } catch (error) {
      console.log("failed to read demo inventory item from db, error: ", error);
      return [null, error];
    }
  }
}
