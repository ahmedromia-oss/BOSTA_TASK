import { Request, Response } from "express";
import { IAuthorController } from "../../Domain/IControllers/IAuthorController.js";
import { Author } from "../../Domain/Models/Author.model.js";
import { validate } from "class-validator";
import { CreateAuthorDto } from "../DTOs/Author/createAuthor.dto.js";
import { plainToInstance } from "class-transformer";
import { BadRequestException } from "../../Application/Errors/BadRequestException.js";
import { IAuthorService } from "../../Domain/IServices/IAuthorService.js";
import { serialize } from "../../Application/Decorators/Serialize.Decorator.js";
import { getAuthorDto } from "../DTOs/Author/getauthor.dto.js";
import { UpdateAuthorDto } from "../DTOs/Author/updateAuthor.dto.js";
import { Auth } from "../../Application/Decorators/authGaurd.decorator.js";
import { UserType } from "../../Domain/constants.js";

export class AuthorController implements IAuthorController {
    constructor(private readonly authorService:IAuthorService){}

    // @Auth(UserType.ADMIN)
    @Auth(UserType.ADMIN)

    @serialize(getAuthorDto)
    async create({body}: Request , res: Response): Promise<Author> {
        const authorData:CreateAuthorDto = plainToInstance(CreateAuthorDto , body)
        if(await this.authorService.checkIFExists({where:{name:authorData.name}})){
            throw new BadRequestException({message:"Author with this name already exists"})
        }

        const errors = await validate(authorData)
        if(errors.length > 0){
            throw new BadRequestException(errors)
        }
        return await this.authorService.create(authorData)
        
    }
    @serialize(getAuthorDto)
    async getById(req: Request, res: Response): Promise<Author | null> {
        const {id} = req.params
        return await this.authorService.findOne({where:{id:Number(id)}})
    }
    @serialize(getAuthorDto)
    async getAll(req: Request, res: Response): Promise<Author[]> {
        return await this.authorService.findAll()
    }
    @Auth(UserType.ADMIN)

    @serialize()
    async update({body , ...req}: Request, res: Response): Promise<string> {
        const {id} = req.params
        const authorData:UpdateAuthorDto = plainToInstance(UpdateAuthorDto ,body )
        const errors = await validate(authorData)
        if(errors.length > 0){
            throw new BadRequestException(errors)
        }
        return await this.authorService.update({id:Number(id)} , authorData)
    }
    @Auth(UserType.ADMIN)

    @serialize()
    async delete(req: Request, res: Response): Promise<string> {
        const {id} = req.params
        return await this.authorService.delete({id:Number(id)})
    }

}