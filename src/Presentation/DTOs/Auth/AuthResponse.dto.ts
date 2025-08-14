import { Expose } from "class-transformer";

export class AuthResponseDto {
  @Expose()
  token: string;
}