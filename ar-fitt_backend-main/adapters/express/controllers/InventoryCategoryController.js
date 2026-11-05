import { mountExpressController } from "../../hono/expressCompat.js";
import { APIResponseMessage } from "../../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../../infra/utils/api_response/APIResponseConstants.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

const defaultApiResponseMessage = new APIResponseMessage(
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
);

export class InventoryCategoryController {
  constructor(
    fetchInventoryCategoriesUseCase,
    fetchInventoryCategoryUseCase,
    authServiceMiddleware,
    commonHeaders,
    inventoryCategoryValidation,
    inventoryCategoriesValidation
  ) {
    this.fetchInventoryCategoriesUseCase = fetchInventoryCategoriesUseCase;
    this.fetchInventoryCategoryUseCase = fetchInventoryCategoryUseCase;
    this.authServiceMiddleware = authServiceMiddleware;
    this.commonHeaders = commonHeaders;
    this.inventoryCategoryValidation = inventoryCategoryValidation;
    this.inventoryCategoriesValidation = inventoryCategoriesValidation;
  }

  async fetchInventoryCategories(req, res) {
    const userType = req.userType;
    const type = req.query.type;
    const userId = req.query.userid;
    const useCaseResponse = await this.fetchInventoryCategoriesUseCase.execute(
      type,
      userType,
      userId
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

  async fetchInventoryCategory(req, res) {
    const categoryID = req.query.categoryID;
    const useCaseResponse = await this.fetchInventoryCategoryUseCase.execute(
      categoryID
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
      "/inventoryCategories",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ALL_USERS_ACCESS, req, res, next),
      (c, req, res, next) => c.inventoryCategoriesValidation.validate(req, res, next),
      (c, req, res) => c.fetchInventoryCategories(req, res)
    );
    router.get(
      "/inventoryCategory",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ALL_USERS_ACCESS, req, res, next),
      (c, req, res, next) => c.inventoryCategoryValidation.validate(req, res, next),
      (c, req, res) => c.fetchInventoryCategory(req, res)
    );
  }
}
