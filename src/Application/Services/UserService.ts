import type { IUserRepository } from "../../Domain/IRepositories/IUserRepository.js";
import type { IUserService } from "../../Domain/IServices/IUserService.js";
import type { User } from "../../Domain/Models/user.model.js";
import type { UserRepository } from "../../Infrastructure/Repositories/UserRepository.js";
import { BaseService } from "./BaseService.js";

export class UserService extends BaseService<User> implements IUserService {
    constructor(private readonly userRepository:IUserRepository){
        super(userRepository)
    }
}