import { AuthorizationServiceController } from "../../adapters/express/controllers/AuthorizationServiceController.js";
import { AuthService } from "../../middleware/authorization_service/usecases/AuthService.js";
import { RefreshTokenUseCase } from "../../usecases/authorization_service/RefreshToken.js";
import { Headers } from "../../middleware/common/headers.js";

// Rebuilt once per request (see adapters/hono/expressCompat.js).
export function buildAuthorizationServiceController(appContext) {
  const authService = new AuthService(appContext.config);
  const commonHeaders = new Headers();

  const refreshTokenUseCase = new RefreshTokenUseCase(authService);

  return new AuthorizationServiceController(refreshTokenUseCase, commonHeaders);
}
