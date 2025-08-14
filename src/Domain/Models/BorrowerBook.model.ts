import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.model.js";
import { Book } from "./Book.model.js";
import { BorrowStatus } from "../constants.js";

@Entity()
@Index('idx_borrow_user_status_created', ['userId', 'status', 'createdAt'])
@Index('idx_borrow_book_created_latest', ['bookId', 'createdAt'])
@Index('idx_borrow_created_desc', ['createdAt'])
export class BookBorrower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  userId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "int" })
  bookId: number;

  @ManyToOne(() => Book, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bookId" })
  book: Book;

  @CreateDateColumn()
  borrowDate: Date;

  @Column({ type: "date" })
  dueDate: Date;

  @Column({ type: "date", nullable: true })
  returnDate: Date | null;

  @Column({
    type: "enum",
    enum: BorrowStatus,
    default: BorrowStatus.BORROWED,
  })
  status: BorrowStatus;

  @Column({ type: "varchar", length: 250, nullable: true })
  remarks: string | null;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt:Date
}
