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

/**
 * Controller managing author CRUD operations
 * Includes admin-only access control for modification operations
 */
export class AuthorController implements IAuthorController {
    constructor(private readonly authorService: IAuthorService) {}

    /**
     * Create a new author (Admin only)
     * Validates uniqueness and data before creation
     */
    @Auth(UserType.ADMIN)
    @serialize(getAuthorDto)
    async create({ body }: Request, res: Response): Promise<Author> {
        // Transform request data to DTO
        const authorData: CreateAuthorDto = plainToInstance(CreateAuthorDto, body)
        
        // Check if author with this name already exists
        if (await this.authorService.checkIFExists({ where: { name: authorData.name } })) {
            throw new BadRequestException({ message: "Author with this name already exists" })
        }

        // Validate the author data
        const errors = await validate(authorData)
        if (errors.length > 0) {
            throw new BadRequestException(errors)
        }
        
        return await this.authorService.create(authorData)
    }

    /**
     * Get author by ID
     * Public endpoint accessible to all authenticated users
     */
    @serialize(getAuthorDto)
    async getById(req: Request, res: Response): Promise<Author | null> {
        const { id } = req.params
        return await this.authorService.findOne({ where: { id: Number(id) } })
    }

    /**
     * Get all authors
     * Public endpoint accessible to all authenticated users
     */
    @serialize(getAuthorDto)
    async getAll(req: Request, res: Response): Promise<Author[]> {
        return await this.authorService.findAll()
    }

    /**
     * Update author information (Admin only)
     * Validates updated data before applying changes
     */
    @Auth(UserType.ADMIN)
    @serialize()
    async update({ body, ...req }: Request, res: Response): Promise<string> {
        const { id } = req.params
        
        // Transform and validate update data
        const authorData: UpdateAuthorDto = plainToInstance(UpdateAuthorDto, body)
        const errors = await validate(authorData)
        if (errors.length > 0) {
            throw new BadRequestException(errors)
        }
        
        return await this.authorService.update({ id: Number(id) }, authorData)
    }

    /**
     * Delete author (Admin only)
     * Removes author from the system
     */
    @Auth(UserType.ADMIN)
    @serialize()
    async delete(req: Request, res: Response): Promise<string> {
        const { id } = req.params
        return await this.authorService.delete({ id: Number(id) })
    }
}