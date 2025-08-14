import { Router } from "express";
import {
  container,
  SERVICE_TOKENS,
} from "../../Infrastructure/DI/ContainerRegistery.js";
import { IAuthorController } from "../../Domain/IControllers/IAuthorController.js";
export function createAuthorRoutes(): Router {
  const router = Router();
  const authorController = container.resolve<IAuthorController>(
    SERVICE_TOKENS.IAuthorController
  );
  router.post("/author/create", authorController.create.bind(authorController));
  router.get("/author/:id", authorController.getById.bind(authorController));
  router.get("/authors", authorController.getAll.bind(authorController));
  router.put("/author/:id", authorController.update.bind(authorController));
  router.delete("/author/:id", authorController.delete.bind(authorController));

  return router;
}
