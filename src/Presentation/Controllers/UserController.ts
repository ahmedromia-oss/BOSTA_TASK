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
import { Auth } from "../../Application/Decorators/authGaurd.decorator.js";
import { UserType } from "../../Domain/constants.js";
import { updateUserDto } from "../DTOs/User/updateUser.dto.js";

/**
 * Controller managing user-related operations
 * Handles user CRUD operations with appropriate access controls
 */
export class UserController implements IUserController {
  constructor(private userService: IUserService) {}

  /**
   * Get user by ID
   * Returns user information for the specified ID
   */
  @serialize(GetUserDto)
  async getUserById(req: Request, res: Response): Promise<User | null> {
    const { id } = req.params;
    return await this.userService.findById(Number(id));
  }

  /**
   * Delete user account (Admin only)
   * Removes user from the system completely
   */
  @Auth(UserType.ADMIN)
  @serialize()
  async deleteUser(req: Request, res: Response): Promise<string> {
    const { id } = req.params;
    return await this.userService.delete({ id: Number(id) });
  }

  /**
   * Update current user's profile (Authenticated users)
   * Users can only update their own profile information
   */
  @Auth()
  @serialize()
  async updateUser({ body, user }: Request, res: Response): Promise<string> {
    // Transform and validate the update data
    const updateDto = plainToInstance(updateUserDto, body , {excludeExtraneousValues:true});
    const errors = await validate(updateDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Update the authenticated user's own profile
    return await this.userService.update({ id: Number(user?.sub) }, updateDto);
  }

  /**
   * Get all users
   * Returns complete list of users in the system
   */
  @serialize(GetUserDto)
  async getUsers(req: Request, res: Response): Promise<User[]> {
    const {skip , take} = req.query
    return await this.userService.findAll({skip:Number(skip??0) , take:Number(take??5)});
  }

  /**
   * Create a new user account
   * Validates user data before creation
   */
  @serialize(GetUserDto)
  async createUser(
    { body }: { body: createUserDto },
    res: Response
  ): Promise<User> {
    // Transform request body to DTO
    const user = plainToInstance(createUserDto, body , {excludeExtraneousValues:true});

    // Validate the user data against DTO constraints
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.userService.create(user);
  }
}