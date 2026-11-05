import { InventoryItemColor } from "../../../entities/InventoryItemColor.js";

export class InventoryItemColorRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getInventoryItemAllColors(itemID) {
    try {
      const result = await this.prisma.inventory_item_color.findMany({
        where: {
          item_id: itemID,
        },
      });

      var itemColors = [];
      result.forEach(function (value) {
        itemColors.push(
          new InventoryItemColor(
            value.id,
            value.item_id,
            value.color,
            value.color_hex,
            value.created_at,
            value.modified_at
          )
        );
      });
      return [itemColors, null];
    } catch (error) {
      console.log(
        "failed to read inventory item colors from db, error: ",
        error
      );
      return [null, error];
    }
  }
}
