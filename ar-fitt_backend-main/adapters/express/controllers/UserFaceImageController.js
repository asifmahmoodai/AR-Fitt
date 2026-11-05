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
const invalidTokenResponse = new APIResponseMessage(
  APIResponseConstants.INVALID_TOKEN_MESSAGE,
  APIResponseConstants.INVALID_TOKEN_CODE
);

export class UserFaceImageController {
  constructor(
    createUserFaceImageUseCase,
    fetchUserFaceImageUseCase,
    updateUserFaceImageUseCase,
    deleteUserFaceImageUseCase,
    fetchUserFaceImageURLUseCase,
    authServiceMiddleware,
    commonHeaders,
    createUserFaceImageValidation,
    fetchUserImageURLValidation
  ) {
    this.createUserFaceImageUseCase = createUserFaceImageUseCase;
    this.fetchUserFaceImageUseCase = fetchUserFaceImageUseCase;
    this.updateUserFaceImageUseCase = updateUserFaceImageUseCase;
    this.deleteUserFaceImageUseCase = deleteUserFaceImageUseCase;
    this.fetchUserFaceImageURLUseCase = fetchUserFaceImageURLUseCase;
    this.authServiceMiddleware = authServiceMiddleware;
    this.commonHeaders = commonHeaders;
    this.createUserFaceImageValidation = createUserFaceImageValidation;
    this.fetchUserImageURLValidation = fetchUserImageURLValidation;
  }

  async createUserFaceImage(req, res) {
    const userType = req.userType;
    const faceImage = req.body.faceImage;
    var userIdentifier;

    switch (userType) {
      case CommonConstants.REGISTERED_USER_TYPE:
        userIdentifier = req.body.email;
        break;
      case CommonConstants.GUEST_USER_TYPE:
        userIdentifier = req.body.userID;
        break;
      default:
        res
          .status(APIResponseConstants.INVALID_TOKEN_STATUS_CODE)
          .send(JSON.stringify(invalidTokenResponse));
        return;
    }

    if (userIdentifier == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
      return;
    }

    const useCaseResponse = await this.createUserFaceImageUseCase.execute(
      userIdentifier,
      faceImage,
      userType
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

  async fetchUserFaceImage(req, res) {
    const userID = req.params.userID;
    const useCaseResponse = await this.fetchUserFaceImageUseCase.execute(
      userID
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
          useCaseResponse.getResponseMessage().getMessage().getFaceImage()
        );
        imageType = imageFileType.mime;
        imageName = util.format("image.%s", imageFileType.ext);
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
      res.end(useCaseResponse.getResponseMessage().getMessage().getFaceImage());
    }
  }

  async updateUserFaceImage(req, res) {
    const userType = req.userType;
    const faceImage = req.body.faceImage;

    var userIdentifier;

    switch (userType) {
      case CommonConstants.REGISTERED_USER_TYPE:
        userIdentifier = req.body.email;
        break;
      case CommonConstants.GUEST_USER_TYPE:
        userIdentifier = req.body.userID;
        break;
      default:
        res
          .status(APIResponseConstants.INVALID_TOKEN_STATUS_CODE)
          .send(JSON.stringify(invalidTokenResponse));
        return;
    }

    if (userIdentifier == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
      return;
    }

    const useCaseResponse = await this.updateUserFaceImageUseCase.execute(
      userIdentifier,
      faceImage,
      userType
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

  async deleteUserFaceImage(req, res) {
    const userType = req.userType;
    var userIdentifier;

    switch (userType) {
      case CommonConstants.REGISTERED_USER_TYPE:
        userIdentifier = req.query.email;
        break;
      case CommonConstants.GUEST_USER_TYPE:
        userIdentifier = req.query.userID;
        break;
      default:
        res
          .status(APIResponseConstants.INVALID_TOKEN_STATUS_CODE)
          .send(JSON.stringify(invalidTokenResponse));
        return;
    }

    if (userIdentifier == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
      return;
    }

    const useCaseResponse = await this.deleteUserFaceImageUseCase.execute(
      userIdentifier,
      userType
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

  async fetchUserFaceImageURL(req, res) {
    const userType = req.userType;
    var userIdentifier;

    switch (userType) {
      case CommonConstants.REGISTERED_USER_TYPE:
        userIdentifier = req.query.email;
        break;
      case CommonConstants.GUEST_USER_TYPE:
        userIdentifier = req.query.userID;
        break;
      default:
        res
          .status(APIResponseConstants.INVALID_TOKEN_STATUS_CODE)
          .send(JSON.stringify(invalidTokenResponse));
        return;
    }

    if (userIdentifier == null) {
      res
        .status(APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send(JSON.stringify(defaultApiResponseMessage));
      return;
    }

    const useCaseResponse = await this.fetchUserFaceImageURLUseCase.execute(
      userIdentifier,
      userType
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
      "/faceImage",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ALL_USERS_ACCESS, req, res, next),
      (c, req, res, next) => c.createUserFaceImageValidation.validate(req, res, next),
      (c, req, res) => c.createUserFaceImage(req, res)
    );
    router.get(
      "/faceImage/:userID",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res) => c.fetchUserFaceImage(req, res)
    );
    router.put(
      "/faceImage",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ALL_USERS_ACCESS, req, res, next),
      (c, req, res, next) => c.createUserFaceImageValidation.validate(req, res, next),
      (c, req, res) => c.updateUserFaceImage(req, res)
    );
    router.delete(
      "/faceImage",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ALL_USERS_ACCESS, req, res, next),
      (c, req, res, next) => c.fetchUserImageURLValidation.validate(req, res, next),
      (c, req, res) => c.deleteUserFaceImage(req, res)
    );
    router.get(
      "/faceImage",
      (c, req, res, next) => c.commonHeaders.addCommonHeaders(req, res, next),
      (c, req, res, next) => c.authServiceMiddleware.verifyToken(CommonConstants.ALL_USERS_ACCESS, req, res, next),
      (c, req, res, next) => c.fetchUserImageURLValidation.validate(req, res, next),
      (c, req, res) => c.fetchUserFaceImageURL(req, res)
    );
  }
}
