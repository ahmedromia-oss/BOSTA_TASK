import { Router } from "express";
import type { IUserController } from "../../Domain/IControllers/IUserController.js";
import { container, SERVICE_TOKENS } from "../../Infrastructure/DI/ContainerRegistery.js";
import type { IAuthController } from "../../Domain/IControllers/IAuthController.js";
export function createAuthRoutes(): Router {
  const router = Router();
  const authController = container.resolve<IAuthController>(SERVICE_TOKENS.IAuthController);
  router.post('/auth/login' , authController.login.bind(authController));
  router.post('/auth/signup' , authController.register.bind(authController));


  return router;
}