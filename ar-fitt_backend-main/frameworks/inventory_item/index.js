import { InventoryItemController } from "../../adapters/express/controllers/InventoryItemController.js";
import { InventoryItemRepository } from "../../adapters/database/repositories/InventoryItemRepository.js";
import { InventoryItemColorRepository } from "../../adapters/database/repositories/InventoryItemColorRepository.js";
import { InventoryItemImageURLRepository } from "../../adapters/database/repositories/InventoryItemImageURLRepository.js";
import { InventoryItemImageRepository } from "../../adapters/database/repositories/InventoryItemImageRepository.js";
import { InventoryItemSizeRepository } from "../../adapters/database/repositories/InventoryItemSizeRepository.js";
import { FetchCategoryInventoryItemsUseCase } from "../../usecases/inventory_item/FetchCategoryInventoryItems.js";
import { FetchInventoryItemImageUseCase } from "../../usecases/inventory_item/FetchInventoryItemImage.js";
import { FetchInventoryItemsUseCase } from "../../usecases/inventory_item/FetchInventoryItems.js";
import { AuthServiceMiddleware } from "../../middleware/authorization_service/usecases/AuthServiceMiddleware.js";
import { Headers } from "../../middleware/common/headers.js";
import { InventoryCategoryValidation } from "../../middleware/data_validation/InventoryCategoryValidation.js";
import { InventoryItemImageValidation } from "../../middleware/data_validation/InventoryItemImageValidation.js";
import { InventoryItemValidation } from "../../middleware/data_validation/InventoryItemValidation.js";

export function buildInventoryItemController(appContext) {
  const inventoryItemRepository = new InventoryItemRepository(appContext.prisma);
  const inventoryItemColorRepository = new InventoryItemColorRepository(appContext.prisma);
  const inventoryItemImageURLRepository = new InventoryItemImageURLRepository(appContext.prisma);
  const inventoryItemImageRepository = new InventoryItemImageRepository(appContext.prisma);
  const inventoryItemSizeRepository = new InventoryItemSizeRepository(appContext.prisma);
  const authServiceMiddleware = new AuthServiceMiddleware(appContext.config);
  const commonHeaders = new Headers();
  const inventoryCategoryValidation = new InventoryCategoryValidation();
  const inventoryItemImageValidation = new InventoryItemImageValidation();
  const inventoryItemValidation = new InventoryItemValidation();

  const fetchCategoryInventoryItemsUseCase =
    new FetchCategoryInventoryItemsUseCase(
      inventoryItemRepository,
      inventoryItemColorRepository,
      inventoryItemImageURLRepository,
      inventoryItemSizeRepository
    );

  const fetchInventoryItemImageUseCase = new FetchInventoryItemImageUseCase(
    inventoryItemImageRepository
  );

  const fetchInventoryItemsUseCase = new FetchInventoryItemsUseCase(
    inventoryItemRepository,
    inventoryItemColorRepository,
    inventoryItemImageURLRepository,
    inventoryItemSizeRepository
  );

  return new InventoryItemController(
    fetchCategoryInventoryItemsUseCase,
    fetchInventoryItemImageUseCase,
    fetchInventoryItemsUseCase,
    authServiceMiddleware,
    commonHeaders,
    inventoryCategoryValidation,
    inventoryItemImageValidation,
    inventoryItemValidation
  );
}
