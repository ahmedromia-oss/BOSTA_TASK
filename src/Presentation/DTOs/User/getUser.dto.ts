import { Expose } from "class-transformer";

export class GetUserDto {
  @Expose()
  username: string;
  @Expose()
  email: string;
}
