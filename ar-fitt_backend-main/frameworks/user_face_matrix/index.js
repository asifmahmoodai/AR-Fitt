import { UserFaceMatrixController } from "../../adapters/express/controllers/UserFaceMatrixController.js";
import { UserRepository } from "../../adapters/database/repositories/UserRepository.js";
import { UserFaceMatrixRepository } from "../../adapters/database/repositories/UserFaceMatrixRepository.js";
import { CreateUserFaceMatrixUseCase } from "../../usecases/user/face_matrix/CreateUserFaceMatrix.js";
import { FetchUserFaceMatrixUseCase } from "../../usecases/user/face_matrix/FetchUserFaceMatrix.js";
import { UpdateUserFaceMatrixUseCase } from "../../usecases/user/face_matrix/UpdateUserFaceMatrix.js";
import { DeleteUserFaceMatrixUseCase } from "../../usecases/user/face_matrix/DeleteUserFaceMatrix.js";
import { AuthServiceMiddleware } from "../../middleware/authorization_service/usecases/AuthServiceMiddleware.js";
import { Headers } from "../../middleware/common/headers.js";

// Rebuilt once per request (see adapters/hono/expressCompat.js) since the Prisma
// client itself must be constructed per request on Workers.
export function buildUserFaceMatrixController(appContext) {
  const userRepository = new UserRepository(appContext.prisma);
  const userFaceMatrixRepository = new UserFaceMatrixRepository(appContext.prisma);
  const authServiceMiddleware = new AuthServiceMiddleware(appContext.config);
  const commonHeaders = new Headers();

  const createUserFaceMatrixUseCase = new CreateUserFaceMatrixUseCase(
    userRepository,
    userFaceMatrixRepository
  );
  const fetchUserFaceMatrixUseCase = new FetchUserFaceMatrixUseCase(
    userRepository,
    userFaceMatrixRepository
  );
  const updateUserFaceMatrixUseCase = new UpdateUserFaceMatrixUseCase(
    userRepository,
    userFaceMatrixRepository
  );
  const deleteUserFaceMatrixUseCase = new DeleteUserFaceMatrixUseCase(
    userRepository,
    userFaceMatrixRepository
  );

  return new UserFaceMatrixController(
    createUserFaceMatrixUseCase,
    fetchUserFaceMatrixUseCase,
    updateUserFaceMatrixUseCase,
    deleteUserFaceMatrixUseCase,
    authServiceMiddleware,
    commonHeaders
  );
}
