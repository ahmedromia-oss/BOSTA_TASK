import { EntityManager } from "typeorm";

export interface IUnitOfWork{
    execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T>
}