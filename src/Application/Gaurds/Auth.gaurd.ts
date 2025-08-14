import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../Errors/UnAuthorizedException.js";
import { Code } from "../../Domain/constants.js";
import { UserToken } from "../../Domain/Models/userToken.model.js";

/**
 * Guard class for JWT token authentication
 * Verifies Bearer tokens and attaches user data to request
 */
export class AuthGuard {
  constructor(private jwtService: JwtService) {}

  authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ):void => {
    // Extract token from Authorization header, removing "Bearer " prefix
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      // No token provided - user is not authenticated
      throw new UnAuthorizedException(Code.UN_AUTORIZED);
    }

    try {
      // Verify the token and decode user information
      const decoded = this.jwtService.verify(token, { secret: "mySecretKey" }) as UserToken;
      req.user = decoded;
      next(); // Continue to next middleware/handler
    } catch (error) {
        // Token verification failed - invalid or expired token
        throw new UnAuthorizedException(Code.UN_AUTORIZED)
    }
  };
}