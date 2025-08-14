import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../../Application/Services/AuthService.js";
import type { IAuthController } from "../../Domain/IControllers/IAuthController.js";
import type { IUserController } from "../../Domain/IControllers/IUserController.js";
import type { IAuthService } from "../../Domain/IServices/IAuthService.js";
import type { IUserService } from "../../Domain/IServices/IUserService.js";
import { AuthController } from "../../Presentation/Controllers/AuthController.js";
import { UserController } from "../../Presentation/Controllers/UserController.js";
import { DIContainer } from "./DIContainer.js";
import { UserService } from "../../Application/Services/UserService.js";
import type { IBaseRepository } from "../../Domain/IRepositories/IBaseRepository.js";
import { User } from "../../Domain/Models/user.model.js";
import type { IUserRepository } from "../../Domain/IRepositories/IUserRepository.js";
import { UserRepository } from "../Repositories/UserRepository.js";
import type { IBookRepository } from "../../Domain/IRepositories/IBookRepository.js";
import { BookRepository } from "../Repositories/BookRepository.js";
import { Book } from "../../Domain/Models/Book.model.js";
import type { IBookService } from "../../Domain/IServices/IBookService.js";
import { BookService } from "../../Application/Services/BookService.js";
import { BaseService } from "../../Application/Services/BaseService.js";
import type { IBaseService } from "../../Domain/IServices/IBaseService.js";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DatabaseService } from "../DataBase/DataBaseService.js";
import { Repository } from "typeorm";
import { IBookController } from "../../Domain/IControllers/IBookController.js";
import { BookController } from "../../Presentation/Controllers/BookController.js";
import { IAuthorRepository } from "../../Domain/IRepositories/IAuthorRepository.js";
import { Author } from "../../Domain/Models/Author.model.js";
import { IAuthorService } from "../../Domain/IServices/IAuthorService.js";
import { AuthorService } from "../../Application/Services/AuthorService.js";
import { IAuthorController } from "../../Domain/IControllers/IAuthorController.js";
import { AuthorController } from "../../Presentation/Controllers/AuthorController.js";
import { BookBorrower } from "../../Domain/Models/BorrowerBook.model.js";
import { IBookBorrowerService } from "../../Domain/IServices/IBorrowerBookService.js";
import { BookBorrowerService } from "../../Application/Services/BookBorrowerService.js";
import { IBorrowController } from "../../Domain/IControllers/IBorrowController.js";
import { BorrowController } from "../../Presentation/Controllers/BorrowController.js";
import { IBorrowerBookRepository } from "../../Domain/IRepositories/IBorrowerBookRepository.js";
import { BookBorrowerRepository } from "../Repositories/BorrowBookRepository.js";
import { AuthorRepository } from "../Repositories/AuthorRepository.js";

// Service tokens
export const SERVICE_TOKENS = {
  IUserService: Symbol("IUserService"),
  IUserController: Symbol("IUserController"),
  IBookController: Symbol("IBookController"),

  IAuthController: Symbol("IAuthController"),
  IAuthorController: Symbol("IAuthorController"),

  IAuthservice: Symbol("IAuthService"),
  IAuthorservice: Symbol("IAuthorService"),

  IBaseRepository: Symbol("IBaseRepository"),
  IBaseService: Symbol("IBaseService"),
  IBookRespository: Symbol("IBookRespository"),
  IUserRepository: Symbol("IUserRepository"),
  IAuthorRepository:Symbol("IAuthorRepository"),
  IBookService: Symbol("IBookService"),
  RepositoryBook: Symbol("RepositoryBook"),
  ReposioryUser: Symbol("ReposioryUser"),
  RepositoryAuthor: Symbol("RepositoryAuthor"),
  RepositoryBookBorrwer: Symbol("RepositoryBookBorrwer"),
  IBookBorrwerService: Symbol("IBookBorrwerService"),
  IBorrowController: Symbol("IBorrowController"),
  IBookBorrwerRepository: Symbol("IBookBorrwerRepository"),
  JwtService: Symbol("JwtService"),
  DataBaseService: Symbol("DataBaseService"),
} as const;

// Container instance
export const container = new DIContainer();
container.registerInterface<IBorrowerBookRepository>(
  SERVICE_TOKENS.IBookBorrwerRepository,
  () => {
    const repoBookBorrower = container.resolve<Repository<BookBorrower>>(
      SERVICE_TOKENS.RepositoryBookBorrwer
    );
    return new BookBorrowerRepository(repoBookBorrower);
  }
);
container.registerInterface<IAuthorRepository>(
  SERVICE_TOKENS.IAuthorRepository,
  () => {
    const repoAuthor = container.resolve<Repository<Author>>(
      SERVICE_TOKENS.RepositoryAuthor
    );
    return new AuthorRepository(repoAuthor);
  }
);
container.registerInterface<IBorrowController>(
  SERVICE_TOKENS.IBorrowController,
  () => {
    const borrowService = container.resolve<IBookBorrowerService>(
      SERVICE_TOKENS.IBookBorrwerService
    );
    return new BorrowController(borrowService);
  },
  true
);

container.register<Repository<BookBorrower>>(
  SERVICE_TOKENS.RepositoryBookBorrwer,
  {
    useFactory: () => {
      const dataSource = DatabaseService.getDataSource();
      return dataSource.getRepository(BookBorrower);
    },
  }
);

container.register<Repository<Author>>(SERVICE_TOKENS.RepositoryAuthor, {
  useFactory: () => {
    const dataSource = DatabaseService.getDataSource();
    return dataSource.getRepository(Author);
  },
});
container.registerInterface<IBookBorrowerService>(
  SERVICE_TOKENS.IBookBorrwerService,
  () =>
    new BookBorrowerService(
      container.resolve<IBorrowerBookRepository>(
        SERVICE_TOKENS.IBookBorrwerRepository
      ),
      container.resolve<IBookService>(SERVICE_TOKENS.IBookService)
    )
);
container.registerInterface<IAuthorService>(
  SERVICE_TOKENS.IAuthorservice,
  () =>
    new AuthorService(
      container.resolve<IAuthorRepository>(SERVICE_TOKENS.IAuthorRepository)
    )
);
container.registerInterface<IAuthorController>(
  SERVICE_TOKENS.IAuthorController,
  () => {
    const authorService = container.resolve<IAuthorService>(
      SERVICE_TOKENS.IAuthorservice
    );
    return new AuthorController(authorService);
  },
  true
);

container.registerInterface<IBookController>(
  SERVICE_TOKENS.IBookController,
  () => {
    const bookService = container.resolve<IBookService>(
      SERVICE_TOKENS.IBookService
    );
    return new BookController(bookService);
  },
  true
);

container.register(SERVICE_TOKENS.JwtService, {
  useFactory: () => new JwtService(),
});

container.register<Repository<Book>>(SERVICE_TOKENS.RepositoryBook, {
  useFactory: () => {
    const dataSource = DatabaseService.getDataSource();
    return dataSource.getRepository(Book);
  },
});
container.register<Repository<User>>(SERVICE_TOKENS.ReposioryUser, {
  useFactory: () => {
    const dataSource = DatabaseService.getDataSource();
    return dataSource.getRepository(User);
  },
});
container.register(SERVICE_TOKENS.DataBaseService, {
  useFactory: () => DatabaseService,
});

container.registerInterface<IBookRepository>(
  SERVICE_TOKENS.IBookRespository,
  () => {
    const repoBook = container.resolve<Repository<Book>>(
      SERVICE_TOKENS.RepositoryBook
    );
    return new BookRepository(repoBook);
  }
);
container.registerInterface<IUserRepository>(
  SERVICE_TOKENS.IUserRepository,
  () => {
    const repoUser = container.resolve<Repository<User>>(
      SERVICE_TOKENS.ReposioryUser
    );
    return new UserRepository(repoUser);
  }
);

container.registerInterface<IBookService>(
  SERVICE_TOKENS.IBookService,
  () =>
    new BookService(
      container.resolve<IBookRepository>(SERVICE_TOKENS.IBookRespository)
    )
);
// Register UserService
container.registerInterface<IUserService>(
  SERVICE_TOKENS.IUserService,
  () =>
    new UserService(
      container.resolve<IUserRepository>(SERVICE_TOKENS.IUserRepository)
    )
);

container.registerInterface<IAuthService>(
  SERVICE_TOKENS.IAuthservice,
  () =>
    new AuthService(
      container.resolve<IUserService>(SERVICE_TOKENS.IUserService),
      container.resolve(SERVICE_TOKENS.JwtService)
    )
);
container.registerInterface<IAuthController>(
  SERVICE_TOKENS.IAuthController,
  () => {
    const authService = container.resolve<IAuthService>(
      SERVICE_TOKENS.IAuthservice
    );
    return new AuthController(authService);
  },
  true
);

// Register UserController
container.registerInterface<IUserController>(
  SERVICE_TOKENS.IUserController,
  () => {
    const userService = container.resolve<IUserService>(
      SERVICE_TOKENS.IUserService
    );
    return new UserController(userService);
  },
  true
);
