import { InventoryItemImage } from "../../../entities/InventoryItemImage.js";

export class InventoryItemImageRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getInventoryItemImage(itemID, imageID) {
    try {
      const result = await this.prisma.inventory_item_image.findFirst({
        where: {
          id: imageID,
          item_id: itemID,
        },
      });
      if (!result) {
        return [null, null];
      }
      return [
        new InventoryItemImage(
          result.id,
          result.item_id,
          result.image,
          result.created_at,
          result.modified_at
        ),
        null,
      ];
    } catch (error) {
      console.log("failed to read item image from db, error: ", error);
      return [null, error];
    }
  }
}
