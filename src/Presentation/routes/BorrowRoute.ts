import { Router } from "express";
import {
  container,
  SERVICE_TOKENS,
} from "../../Infrastructure/DI/ContainerRegistery.js";
import { IBorrowController } from "../../Domain/IControllers/IBorrowController.js";

export function createBorrowRoutes(): Router {
  const router = Router();
  const borrowController = container.resolve<IBorrowController>(
    SERVICE_TOKENS.IBorrowController
  );
  router.post(
    "/borrow/:bookId",
    borrowController.borrowBook.bind(borrowController)
  );

  router.post(
    "/borrow/return/:bookId",
    borrowController.returnBook.bind(borrowController)
  );

  router.get(
    "/borrowed",
    borrowController.getBorrowedBooks.bind(borrowController)
  );

  router.get(
    "/overdue",
    borrowController.getOverdueBooks.bind(borrowController)
  );
    router.get(
    "/admin/borrowed",
    borrowController.AllgetBorrowedBooks.bind(borrowController)
  );

  router.get(
    "/admin/overdue",
    borrowController.AllgetOverdueBooks.bind(borrowController)
  );

  return router;
}
