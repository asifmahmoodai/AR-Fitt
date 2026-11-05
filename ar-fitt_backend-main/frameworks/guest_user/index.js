import { GuestUserController } from "../../adapters/express/controllers/GuestUserController.js";
import { UserRepository } from "../../adapters/database/repositories/UserRepository.js";
import { RegisterGuestUserUseCase } from "../../usecases/guest_user/RegisterGuestUser.js";
import { AuthService } from "../../middleware/authorization_service/usecases/AuthService.js";
import { Headers } from "../../middleware/common/headers.js";
import { GuestUserValidation } from "../../middleware/data_validation/GuestUserValidation.js";

// Rebuilt once per request (see adapters/hono/expressCompat.js) since the Prisma
// client itself must be constructed per request on Workers.
export function buildGuestUserController(appContext) {
  const userRepository = new UserRepository(appContext.prisma);
  const authService = new AuthService(appContext.config);
  const commonHeaders = new Headers();
  const guestUserValidation = new GuestUserValidation();

  const registerGuestUseCase = new RegisterGuestUserUseCase(userRepository);

  return new GuestUserController(
    registerGuestUseCase,
    authService,
    commonHeaders,
    guestUserValidation
  );
}
