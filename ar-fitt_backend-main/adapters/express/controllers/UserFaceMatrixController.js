import { mountExpressController } from "../../hono/expressCompat.js";
import { APIResponseMessage } from "../../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../../infra/utils/api_response/APIResponseConstants.js";
import { CommonConstants } from "../../../infra/utils/common/Constants.js";

const defaultApiResponseMessage = new APIResponseMessage(
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
  APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
);

export class UserFaceMatrixController {
  constructor(
    createUserFaceMatrixUseCase,
    fetchUserFaceMatrixUseCase,
    updateUserFaceMatrixUseCase,
    deleteUserFaceMatrixUseCase,
    authServiceMiddleware,
    commonHeaders
  ) {
    this.createUserFaceMatrixUseCase = createUserFaceMatrixUseCase;
    this.fetchUserFaceMatrixUseCase = fetchUserFaceMatrixUseCase;
    this.updateUserFaceMatrixUseCase = updateUserFaceMatrixUseCase;
    this.deleteUserFaceMatrixUseCase = deleteUserFaceMatrixUseCase;
    this.authServiceMiddleware = authServiceMiddleware;
    this.commonHeaders = commonHeaders;
  }

  async createUserFaceMatrix(req, res) {
    const { email, faceMatrix } = req.body;
    const useCaseResponse = await this.createUserFaceMatrixUseCase.execute(
      email,
      faceMatrix
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

  async fetchUserFaceMatrix(req, res) {
    const email = req.query.email;
    const useCaseResponse = await this.fetchUserFaceMatrixUseCase.execute(
      email
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

  async updateUserFaceMatrix(req, res) {
    const { email, faceMatrix } = req.body;
    const useCaseResponse = await this.updateUserFaceMatrixUseCase.execute(
      email,
      faceMatrix
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

  async deleteUserFaceMatrix(req, res) {
    const email = req.query.email;
    const useCaseResponse = await this.deleteUserFaceMatrixUseCase.execute(
      email
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
    router.post(
      "/faceMatrix",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ONLY_REGISTERED_USER_ACCESS, req, res, next),
      (c, req, res) => c.createUserFaceMatrix(req, res)
    );
    router.get(
      "/faceMatrix",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ONLY_REGISTERED_USER_ACCESS, req, res, next),
      (c, req, res) => c.fetchUserFaceMatrix(req, res)
    );
    router.put(
      "/faceMatrix",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ONLY_REGISTERED_USER_ACCESS, req, res, next),
      (c, req, res) => c.updateUserFaceMatrix(req, res)
    );
    router.delete(
      "/faceMatrix",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ONLY_REGISTERED_USER_ACCESS, req, res, next),
      (c, req, res) => c.deleteUserFaceMatrix(req, res)
    );
  }
}
