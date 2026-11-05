import { UserFaceImageController } from "../../adapters/express/controllers/UserFaceImageController.js";
import { UserRepository } from "../../adapters/database/repositories/UserRepository.js";
import { UserFaceImageRepository } from "../../adapters/database/repositories/UserFaceImageRepository.js";
import { CreateUserFaceImageUseCase } from "../../usecases/user/face_image/CreateUserFaceImage.js";
import { FetchUserFaceImageUseCase } from "../../usecases/user/face_image/FetchUserFaceImage.js";
import { UpdateUserFaceImageUseCase } from "../../usecases/user/face_image/UpdateUserFaceImage.js";
import { DeleteUserFaceImageUseCase } from "../../usecases/user/face_image/DeleteUserFaceImage.js";
import { FetchUserFaceImageURLUseCase } from "../../usecases/user/face_image/FetchUserFaceImageURL.js";
import { AuthServiceMiddleware } from "../../middleware/authorization_service/usecases/AuthServiceMiddleware.js";
import { Headers } from "../../middleware/common/headers.js";
import { CreateUserFaceImageValidation } from "../../middleware/data_validation/CreateUserFaceImageValidation.js";
import { FetchUserImageURLValidation } from "../../middleware/data_validation/FetchUserImageURLValidation.js";

// Rebuilt once per request (see adapters/hono/expressCompat.js) since the Prisma
// client itself must be constructed per request on Workers.
export function buildUserFaceImageController(appContext) {
  const userRepository = new UserRepository(appContext.prisma);
  const userFaceImageRepository = new UserFaceImageRepository(appContext.prisma);
  const authServiceMiddleware = new AuthServiceMiddleware(appContext.config);
  const commonHeaders = new Headers();
  const createUserFaceImageValidation = new CreateUserFaceImageValidation();
  const fetchUserImageURLValidation = new FetchUserImageURLValidation();

  const createUserFaceImageUseCase = new CreateUserFaceImageUseCase(
    userRepository,
    userFaceImageRepository
  );
  const fetchUserFaceImageUseCase = new FetchUserFaceImageUseCase(
    userFaceImageRepository
  );
  const updateUserFaceImageUseCase = new UpdateUserFaceImageUseCase(
    userRepository,
    userFaceImageRepository
  );
  const deleteUserFaceImageUseCase = new DeleteUserFaceImageUseCase(
    userRepository,
    userFaceImageRepository
  );
  const fetchUserFaceImageURLUseCase = new FetchUserFaceImageURLUseCase(
    userRepository,
    userFaceImageRepository
  );

  return new UserFaceImageController(
    createUserFaceImageUseCase,
    fetchUserFaceImageUseCase,
    updateUserFaceImageUseCase,
    deleteUserFaceImageUseCase,
    fetchUserFaceImageURLUseCase,
    authServiceMiddleware,
    commonHeaders,
    createUserFaceImageValidation,
    fetchUserImageURLValidation
  );
}
