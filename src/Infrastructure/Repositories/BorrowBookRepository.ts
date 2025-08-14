import { Repository } from "typeorm";
import { IAuthorRepository } from "../../Domain/IRepositories/IAuthorRepository.js";
import { Author } from "../../Domain/Models/Author.model.js";
import { BaseRepository } from "./BaseRepository.js";
import { BookBorrower } from "../../Domain/Models/BorrowerBook.model.js";
import { IBorrowerBookRepository } from "../../Domain/IRepositories/IBorrowerBookRepository.js";
import { BorrowStatus } from "../../Domain/constants.js";

export class BookBorrowerRepository
  extends BaseRepository<BookBorrower>
  implements IBorrowerBookRepository
{
  constructor(repository: Repository<BookBorrower>) {
    super(repository);
  }
  async getBorrowedBooksByUser(
    userId: number,
    skip?: number,
    take?: number
  ): Promise<BookBorrower[]> {
    const sub = this.repository
      .createQueryBuilder("sub_bb")
      .select("sub_bb.bookId", "bookId")
      .addSelect("MAX(sub_bb.createdAt)", "max_created")
      .groupBy("sub_bb.bookId");

    const result = await this.repository
      .createQueryBuilder("bb")
      .innerJoin(
        `(${sub.getQuery()})`,
        "m",
        'bb."bookId" = m."bookId" AND bb."createdAt" = m.max_created'
      )
      .innerJoinAndSelect("bb.book", "b")
      .where("bb.status = :status")
      .andWhere("bb.userId = :userId") // filter by userId
      .setParameters({
        ...(sub.getParameters ? sub.getParameters() : {}),
        status: BorrowStatus.BORROWED,
        userId,
      })
      .take(take ?? 5)
      .skip(skip ?? 0)
      .getMany();
    return result;
  }
  async getOverDuedBookByUser(
    userId: number,
    skip?: number,
    take?: number
  ): Promise<BookBorrower[]> {
    const sub = this.repository
      .createQueryBuilder("sub_bb")
      .select("sub_bb.bookId", "bookId")
      .addSelect("MAX(sub_bb.createdAt)", "max_created")
      .groupBy("sub_bb.bookId");

    const result = await this.repository
      .createQueryBuilder("bb")
      .innerJoin(
        `(${sub.getQuery()})`,
        "m",
        'bb."bookId" = m."bookId" AND bb."createdAt" = m.max_created'
      )
      .innerJoinAndSelect("bb.book", "b")
      .where("bb.status = :status")
      .andWhere("bb.userId = :userId") // filter by userId
      .andWhere("bb.dueDate < :currentDate")
      .setParameters({
        ...(sub.getParameters ? sub.getParameters() : {}),
        status: BorrowStatus.BORROWED,
        userId,
        currentDate: new Date(),
      })
      .take(take ?? 5)
      .skip(skip ?? 0)
      .getMany();

    return result;
  }
  async getOverDuedBooks(
    skip?: number,
    take?: number
  ): Promise<BookBorrower[]> {
    // subquery: for each bookId get the latest createdAt
    const sub = this.repository
      .createQueryBuilder("sub_bb")
      .select("sub_bb.bookId", "bookId")
      .addSelect("MAX(sub_bb.createdAt)", "max_created")
      .groupBy("sub_bb.bookId");

    // main query: join the subquery on bookId + createdAt, load relations, filter by status and due date
    const result = await this.repository
      .createQueryBuilder("bb")
      .innerJoin(
        `(${sub.getQuery()})`,
        "m",
        'bb."bookId" = m."bookId" AND bb."createdAt" = m.max_created'
      )
      .innerJoinAndSelect("bb.book", "b")
      .innerJoinAndSelect("bb.user", "u")
      .where("bb.status = :status")
      .andWhere("bb.dueDate < :currentDate")
      .setParameters({
        ...(sub.getParameters ? sub.getParameters() : {}),
        status: BorrowStatus.BORROWED,
        currentDate: new Date(),
      })
      .skip(skip ?? 0)
      .take(take ?? 5)
      .getMany();
    return result;
  }

  async getBorrowedBooks(
    skip?: number,
    take?: number
  ): Promise<BookBorrower[]> {
    const sub = this.repository
      .createQueryBuilder("sub_bb")
      .select("sub_bb.bookId", "bookId")
      .addSelect("MAX(sub_bb.createdAt)", "max_created")
      .groupBy("sub_bb.bookId");

    // main query: join the subquery on bookId + createdAt, load relations, filter by status
    const result = await this.repository
      .createQueryBuilder("bb")
      .innerJoin(
        `(${sub.getQuery()})`,
        "m",
        'bb.bookId = m."bookId" AND bb."createdAt" = m.max_created'
      )
      .innerJoinAndSelect("bb.book", "b")
      .innerJoinAndSelect("bb.user", "u")
      .where("bb.status = :status")
      .setParameters({
        ...(sub.getParameters ? sub.getParameters() : {}),
        status: BorrowStatus.BORROWED,
      })
      .skip(skip ?? 0)
      .take(take ?? 5)
      .getMany();

    return result;
  }
}
