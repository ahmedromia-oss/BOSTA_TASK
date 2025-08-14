import { Router } from "express";
import type { IUserController } from "../../Domain/IControllers/IUserController.js";
import {
  container,
  SERVICE_TOKENS,
} from "../../Infrastructure/DI/ContainerRegistery.js";
export function createUserRoutes(): Router {
  const router = Router();
  const userController = container.resolve<IUserController>(
    SERVICE_TOKENS.IUserController
  );
  router.get("/", userController.getUsers.bind(userController));
  router.post("/create", userController.createUser.bind(userController));
  router.put("/update", userController.updateUser.bind(userController));
  router.get("/user/:id", userController.getUserById.bind(userController));

  router.delete("/delete/:id", userController.deleteUser.bind(userController));

  return router;
}
