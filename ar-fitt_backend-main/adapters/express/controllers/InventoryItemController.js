import { mountExpressController } from "../../hono/expressCompat.js";
import util from "util";
import { fileTypeFromBuffer } from "file-type";
import { APIResponseMessage } from "../../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../../infra/utils/api_response/APIResponseConstants.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

const defaultApiResponseMessage = new APIResponseMessage(
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
);

export class InventoryItemController {
  constructor(
    fetchCategoryInventoryItemsUseCase,
    fetchInventoryItemImageUseCase,
    fetchInventoryItemsUseCase,
    authServiceMiddleware,
    commonHeaders,
    inventoryCategoryValidation,
    inventoryItemImageValidation,
    inventoryItemValidation
  ) {
    this.fetchCategoryInventoryItemsUseCase =
      fetchCategoryInventoryItemsUseCase;
    this.fetchInventoryItemImageUseCase = fetchInventoryItemImageUseCase;
    this.fetchInventoryItemsUseCase = fetchInventoryItemsUseCase;
    this.authServiceMiddleware = authServiceMiddleware;
    this.commonHeaders = commonHeaders;
    this.inventoryCategoryValidation = inventoryCategoryValidation;
    this.inventoryItemImageValidation = inventoryItemImageValidation;
    this.inventoryItemValidation = inventoryItemValidation;
  }

  async fetchCategoryInventoryItems(req, res) {
    console.log("UserId");
    console.log(req.query.userid);
    const userType = req.userType;
    const categoryID = req.query.categoryID;
    // pass authenticated user identifier (assumed exist as req.userID)
    const useCaseResponse =
      await this.fetchCategoryInventoryItemsUseCase.execute(
        categoryID,
        userType,
        req.query.userid
        // "591fa826-73f1-46d2-99e3-cb2b25e062cf"
      );
    if (useCaseResponse == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
    } else {
      res
        .status(useCaseResponse.getStatusCode())
        .send(JSON.stringify(useCaseResponse.getResponseMessage()));
    }
  }

  async fetchInventoryItemImage(req, res) {
    const itemID = req.params.itemID;
    const imageURLID = req.params.imageURLID;
    const useCaseResponse = await this.fetchInventoryItemImageUseCase.execute(
      itemID,
      imageURLID
    );
    if (useCaseResponse == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
    } else {
      if (
        typeof useCaseResponse.getResponseMessage().getMessage() == "string"
      ) {
        res
          .status(useCaseResponse.getStatusCode())
          .send(JSON.stringify(useCaseResponse.getResponseMessage()));
        return;
      }

      var imageType, imageName;
      try {
        const imageFileType = await fileTypeFromBuffer(
          useCaseResponse.getResponseMessage().getMessage().getImage()
        );
        imageName = util.format("image.%s", imageFileType.ext);
        imageType = imageFileType.mime;
      } catch (error) {
        console.log("failed to detect image type, error: ", error);
        // fallback if image type is not detected
        imageType = "image/png";
        imageName = "image.png";
      }

      res.writeHead(useCaseResponse.getStatusCode(), {
        "Content-Disposition": util.format(
          'attachment; filename="%s"',
          imageName
        ),
        "Content-Type": imageType,
      });
      res.end(useCaseResponse.getResponseMessage().getMessage().getImage());
    }
  }

  async fetchInventoryItems(req, res) {
    const { itemIDs } = req.body;
    const useCaseResponse = await this.fetchInventoryItemsUseCase.execute(
      itemIDs
    );
    if (useCaseResponse == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
    } else {
      res
        .status(useCaseResponse.getStatusCode())
        .send(JSON.stringify(useCaseResponse.getResponseMessage()));
    }
  }

  static registerRoutes(app, buildController) {
    const router = mountExpressController(app, buildController);
    router.get(
      "/category/inventoryItems",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ALL_USERS_ACCESS, req, res, next),
      (c, req, res, next) => c.inventoryCategoryValidation.validate(req, res, next),
      (c, req, res) => c.fetchCategoryInventoryItems(req, res)
    );
    router.get(
      "/itemImage/:itemID/:imageURLID",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.inventoryItemImageValidation.validate(req, res, next),
      (c, req, res) => c.fetchInventoryItemImage(req, res)
    );
    router.get(
      "/inventoryItems",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ALL_USERS_ACCESS, req, res, next),
      (c, req, res, next) => c.inventoryItemValidation.validate(req, res, next),
      (c, req, res) => c.fetchInventoryItems(req, res)
    );
  }
}
