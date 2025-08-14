import { Expose } from "class-transformer";
import { UserType } from "../../../Domain/constants.js";

export class GetUserDto {
  @Expose()
  id:string
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  userType:UserType
}
