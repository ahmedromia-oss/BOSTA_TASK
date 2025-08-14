import type { User } from "../Models/user.model.js";
import type { IBaseService } from "./IBaseService.js";

export interface IUserService extends IBaseService<User> {
  
}