import { ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { ServiceResponse } from "../../Domain/Models/ServiceReponse.model.js";
import { Code } from "../../Domain/constants.js";
import { QueryFailedError } from "typeorm";
import { NotFoundException } from "../../Application/Errors/NotFoundException.js";
import { ForbiddenException } from "../../Application/Errors/ForbiddenException.js";
import { UnAuthorizedException } from "../../Application/Errors/UnAuthorizedException.js";
import { BadRequestException } from "../../Application/Errors/BadRequestException.js";

/**
 * Global error handler middleware for Express
 * Converts various error types into standardized API responses
 */
export function responseExceptionHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Handle validation errors from class-validator decorators
    if (err.errors && Array.isArray(err.errors) && err instanceof BadRequestException) {
      // Transform validation errors into field-specific error messages
      let obj = {} as any;
      err.errors.forEach((e: any) => {
        obj[e["property"]] = Object.values(e["constraints"])[0];
      });

      const errorResponse: ServiceResponse<object> = {
        code: Code.BAD_INPUT,
        Errors: obj,
      };

      return res.status(400).json(errorResponse);
    }

    // Handle TypeORM database query failures
    if (err instanceof QueryFailedError) {
      return res.status(400).json({ code: Code.SMTH_WITH_DB });
    }

    // Handle resource not found errors
    if (err instanceof NotFoundException) {
      return res.status(404).json({ code: Code.NOT_FOUND });
    }

    // Handle permission denied errors
    if (err instanceof ForbiddenException) {
      if (err.message !== Code.FORBIDDEN) {
        return res.status(403).json({ code: Code.FORBIDDEN });
      }
      return res.status(403).json({ code: Code.FORBIDDEN });
    }

    // Handle authentication failures
    if (err instanceof UnAuthorizedException) {
      return res.status(401).json({ code: Code.UN_AUTORIZED });
    } else {
      // Handle other bad request errors with custom messages
      return res.status(400).json({
        code: err.errors.message,
      });
    }
  } catch (e) {
    // Fallback error handling for unexpected errors
    return res.status(400).json({
      code: err.message,
    });
  }
}