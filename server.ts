import express from "express";
import "reflect-metadata";
import { createUserRoutes } from "./src/Presentation/routes/UserRoutes.js";
import { DatabaseService } from "./src/Infrastructure/DataBase/DataBaseService.js";
import { responseExceptionHandler } from "./src/Presentation/Filters/ExceptionFitler.js";
import { createAuthRoutes } from "./src/Presentation/routes/AuthRoutes.js";
import { createBookRoutes } from "./src/Presentation/routes/BookRoutes.js";
import { createAuthorRoutes } from "./src/Presentation/routes/AuthorRoutes.js";
import { createBorrowRoutes } from "./src/Presentation/routes/BorrowRoute.js";

const app = express();

await DatabaseService.initialize(); // ok to init DB before registering routes

app.use(express.json());

// Register routers / middleware that should handle requests
app.use(createUserRoutes());
app.use(createAuthRoutes());
app.use(createBookRoutes());
app.use(createAuthorRoutes())
app.use(createBorrowRoutes())



// Optional: a 404 fallback for unmatched routes


// ERROR HANDLER - must be last middleware
app.use(responseExceptionHandler);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
