import { UserBodyMatrixController } from "../../adapters/express/controllers/UserBodyMatrixController.js";
import { UserRepository } from "../../adapters/database/repositories/UserRepository.js";
import { UserBodyMatrixRepository } from "../../adapters/database/repositories/UserBodyMatrixRepository.js";
import { CreateUserBodyMatrixUseCase } from "../../usecases/user/body_matrix/CreateUserBodyMatrix.js";
import { FetchUserBodyMatrixUseCase } from "../../usecases/user/body_matrix/FetchUserBodyMatrix.js";
import { UpdateUserBodyMatrixUseCase } from "../../usecases/user/body_matrix/UpdateUserBodyMarix.js";
import { DeleteUserBodyMatrixUseCase } from "../../usecases/user/body_matrix/DeleteUserBodyMatrix.js";
import { AuthServiceMiddleware } from "../../middleware/authorization_service/usecases/AuthServiceMiddleware.js";
import { Headers } from "../../middleware/common/headers.js";

// Rebuilt once per request (see adapters/hono/expressCompat.js) since the Prisma
// client itself must be constructed per request on Workers.
export function buildUserBodyMatrixController(appContext) {
  const userRepository = new UserRepository(appContext.prisma);
  const userBodyMatrixRepository = new UserBodyMatrixRepository(appContext.prisma);
  const authServiceMiddleware = new AuthServiceMiddleware(appContext.config);
  const commonHeaders = new Headers();

  const createUserBodyMatrixUseCase = new CreateUserBodyMatrixUseCase(
    userRepository,
    userBodyMatrixRepository
  );
  const fetchUserBodyMatrixUseCase = new FetchUserBodyMatrixUseCase(
    userRepository,
    userBodyMatrixRepository
  );
  const updateUserBodyMatrixUseCase = new UpdateUserBodyMatrixUseCase(
    userRepository,
    userBodyMatrixRepository
  );
  const deleteUserBodyMatrixUseCase = new DeleteUserBodyMatrixUseCase(
    userRepository,
    userBodyMatrixRepository
  );

  return new UserBodyMatrixController(
    createUserBodyMatrixUseCase,
    fetchUserBodyMatrixUseCase,
    updateUserBodyMatrixUseCase,
    deleteUserBodyMatrixUseCase,
    authServiceMiddleware,
    commonHeaders
  );
}
