import { type Response, type Request } from "express";
import type { IUserController } from "../../Domain/IControllers/IUserController.js";
import type { IUserService } from "../../Domain/IServices/IUserService.js";
import { serialize } from "../../Application/Decorators/Serialize.Decorator.js";
import { GetUserDto } from "../DTOs/User/getUser.dto.js";
import { User } from "../../Domain/Models/user.model.js";
import { createUserDto } from "../DTOs/User/CreateUser.dto.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BadRequestException } from "../../Application/Errors/BadRequestException.js";

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}
  @serialize(GetUserDto)
  async getUsers(req: Request, res: Response): Promise<User[]> {
    return await this.userService.findAll();
  }
  @serialize(GetUserDto)
  async createUser(
    { body }: { body: createUserDto },
    res: Response
  ): Promise<User> {
    const user = plainToInstance(createUserDto, body);

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.userService.create(user);
  }
}
