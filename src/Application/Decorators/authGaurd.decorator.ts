import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "../Gaurds/Auth.gaurd.js";
import { ForbiddenException } from "../../Application/Errors/ForbiddenException.js";
import { Code, ValidationErrors } from "../../Domain/constants.js";

// Initialize JWT service and auth guard instances
const jwtService = new JwtService();
const authGuard = new AuthGuard(jwtService);

/**
 * Auth decorator with optional role check.
 * @param requiredRoles A string or array of roles (userType values) allowed to access the method.
 */
export function Auth(requiredRoles?: string | string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        // First step: verify the user's token is valid
        await new Promise<void>((resolve, reject) => {
          authGuard.authenticate(req, res, (err?: any) => {
            if (err) return reject(err);
            resolve();
          });
        });

        // Second step: if roles are specified, check user has permission
        if (requiredRoles) {
          const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
          if (!req.user || !rolesArray.includes(req.user.userType)) {
            throw new ForbiddenException(Code.FORBIDDEN);
          }
        }

        // All checks passed, execute the original controller method
        const result = originalMethod.call(this, req, res, next);
        if (result instanceof Promise) {
          await result;
        }
      } catch (error) {
        // Pass any errors to Express error handler
        next(error);
      }
    };

    return descriptor;
  };
}