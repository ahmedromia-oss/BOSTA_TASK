import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../Errors/UnAuthorizedException.js";
import { Code } from "../../Domain/constants.js";
import { UserToken } from "../../Domain/Models/userToken.model.js";
export class AuthGuard {
  constructor(private jwtService: JwtService) {}

  authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ):void => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      // Option 1: Just throw (let exception handler deal with response)
      throw new UnAuthorizedException(Code.UN_AUTORIZED);
    }

    try {
      const decoded = this.jwtService.verify(token, { secret: "mySecretKey" }) as UserToken;
      req.user = decoded;
      next(); // ✅ Call next() to continue
    } catch (error) {
        throw new UnAuthorizedException(Code.UN_AUTORIZED)
    }
  };
}
