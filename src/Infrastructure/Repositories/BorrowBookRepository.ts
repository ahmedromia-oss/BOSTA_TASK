import { Repository } from "typeorm";
import { IAuthorRepository } from "../../Domain/IRepositories/IAuthorRepository.js";
import { Author } from "../../Domain/Models/Author.model.js";
import { BaseRepository } from "./BaseRepository.js";
import { BookBorrower } from "../../Domain/Models/BorrowerBook.model.js";
import { IBorrowerBookRepository } from "../../Domain/IRepositories/IBorrowerBookRepository.js";
import { Book } from "../../Domain/Models/Book.model.js";
import { BorrowStatus } from "../../Domain/constants.js";

export class BookBorrowerRepository
  extends BaseRepository<BookBorrower>
  implements IBorrowerBookRepository
{
  constructor(repository: Repository<BookBorrower>) {
    super(repository);
  }
  async getBorrowedBooksByUser(userId: number): Promise<BookBorrower[]> {
    const result = await this.repository.manager.query(
      `
   SELECT *
  FROM (
    SELECT bb.*, b.*,
           ROW_NUMBER() OVER (
             PARTITION BY bb."bookId" 
             ORDER BY bb."createdAt" DESC
           ) as rn
    FROM book_borrower bb
    JOIN book b ON bb."bookId" = b.id
      AND bb."userId" = $1
  ) ranked
  WHERE (status = '${BorrowStatus.BORROWED}') and rn = 1

  
`,
      [userId]
    );

    return result;
  }
  async getOverDuedBookByUser(userId: number): Promise<BookBorrower[]> {
    const result = await this.repository.manager.query(
      `
   SELECT *
  FROM (
    SELECT bb.*, b.*,
           ROW_NUMBER() OVER (
             PARTITION BY bb."bookId" 
             ORDER BY bb."createdAt" DESC
           ) as rn
    FROM book_borrower bb
    JOIN book b ON bb."bookId" = b.id
      AND bb."userId" = $1
  ) ranked
  WHERE status = '${BorrowStatus.OVERDUE}' and rn = 1

  
`,
      [userId]
    );

    return result;
  }
  async getOverDuedBooks() {
    const result = await this.repository.manager.query(
      `
  SELECT *   
FROM (     
  SELECT bb.*, b.*, u.*,
         ROW_NUMBER() OVER (              
           PARTITION BY bb."bookId"               
           ORDER BY bb."createdAt" DESC            
         ) as rn     
  FROM book_borrower bb     
  JOIN book b ON bb."bookId" = b.id
  JOIN "user" u ON bb."userId" = u.id       
) ranked   
WHERE status = '${BorrowStatus.OVERDUE}' AND rn = 1`
    );

    return result;
  }

  async getBorrowedBooks() {
    const result = await this.repository.manager.query(
      `
  SELECT *   
FROM (     
  SELECT bb.*, b.*, u.*,
         ROW_NUMBER() OVER (              
           PARTITION BY bb."bookId"               
           ORDER BY bb."createdAt" DESC            
         ) as rn     
  FROM book_borrower bb     
  JOIN book b ON bb."bookId" = b.id
  JOIN "user" u ON bb."userId" = u.id       
) ranked   
WHERE status = '${BorrowStatus.BORROWED}' AND rn = 1`
    );

    return result;
  }
}
