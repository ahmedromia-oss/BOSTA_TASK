import { Router } from "express";
import type { IUserController } from "../../Domain/IControllers/IUserController.js";
import { container, SERVICE_TOKENS } from "../../Infrastructure/DI/ContainerRegistery.js";
import type { IAuthController } from "../../Domain/IControllers/IAuthController.js";
import { IBookController } from "../../Domain/IControllers/IBookController.js";
export function createBookRoutes(): Router {
  const router = Router();
  const bookController = container.resolve<IBookController>(SERVICE_TOKENS.IBookController);
  router.post('/book' , bookController.create.bind(bookController));
  router.get('/book' , bookController.getAll.bind(bookController));
  router.get('/book/:id' , bookController.getById.bind(bookController));
  router.put('/book/:id' , bookController.update.bind(bookController)) 
  router.delete('/book/:id' , bookController.delete.bind(bookController))
  router.get('/book/search' , bookController.searchBooks.bind(bookController))

  


  return router;
}