import { UserType } from "../constants.js";

export class UserToken{
    sub:number;
    userType:UserType
}
declare global {
  namespace Express {
    interface Request {
      user?: UserToken;
    }
  }
}
