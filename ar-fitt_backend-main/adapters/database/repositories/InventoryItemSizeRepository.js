import { InventoryItemSize } from "../../../entities/InventoryItemSize.js";

export class InventoryItemSizeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getInventoryItemAllSizes(itemID) {
    try {
      const result = await this.prisma.inventory_item_size.findMany({
        where: {
          item_id: itemID,
        },
      });
      var itemSizes = [];
      result.forEach(function (value) {
        itemSizes.push(
          new InventoryItemSize(
            value.id,
            value.item_id,
            value.size,
            value.created_at,
            value.modified_at
          )
        );
      });
      return [itemSizes, null];
    } catch (error) {
      console.log(
        "failed to read inventory item sizes from db, error: ",
        error
      );
      return [null, error];
    }
  }
}
