import { InventoryItemImageURL } from "../../../entities/InventoryItemImageURL.js";

export class InventoryItemImageURLRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getInventoryItemAllImagesURLs(itemID) {
    try {
      const result = await this.prisma.inventory_item_image_url.findMany({
        where: {
          item_id: itemID,
        },
      });
      var imageURLs = [];
      result.forEach(function (value) {
        imageURLs.push(
          new InventoryItemImageURL(
            value.id,
            value.item_id,
            value.image_url,
            value.created_at,
            value.modified_at
          )
        );
      });
      return [imageURLs, null];
    } catch (error) {
      console.log("failed to read item image urls from db, error: ", error);
      return [null, error];
    }
  }
}
