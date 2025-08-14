import { ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { ServiceResponse } from "../../Domain/Models/ServiceReponse.model.js";
import { Code } from "../../Domain/constants.js";
import { QueryFailedError } from "typeorm";
import { NotFoundException } from "../../Application/Errors/NotFoundException.js";
import { ForbiddenException } from "../../Application/Errors/ForbiddenException.js";
import { UnAuthorizedException } from "../../Application/Errors/UnAuthorizedException.js";
import { BadRequestException } from "../../Application/Errors/BadRequestException.js";

export function responseExceptionHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Handle class-validator style validation errors
  try {
    if (err.errors && Array.isArray(err.errors) && err instanceof BadRequestException) {
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

    // Handle database errors
    if (err instanceof QueryFailedError) {
      return res.status(400).json({ code: Code.SMTH_WITH_DB });
    }

    // Handle known custom exceptions
    if (err instanceof NotFoundException) {
      return res.status(404).json({ code: Code.NOT_FOUND });
    }

    if (err instanceof ForbiddenException) {
      if (err.message !== Code.UN_VERIFIED) {
        return res.status(403).json({ code: Code.FORBIDDEN });
      }
      return res.status(403).json({ code: Code.UN_VERIFIED });
    }

    if (err instanceof UnAuthorizedException) {
      return res.status(401).json({ code: Code.UN_AUTORIZED });
    } else {
      return res.status(400).json({
        code: err.errors.message,
       
      });
    }
  } catch (e) {
    // Fallback
    return res.status(400).json({
      code: err.message,
    });
  }
}
