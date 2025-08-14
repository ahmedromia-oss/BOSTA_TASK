import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
  Index,
} from "typeorm";
import { Author } from "./Author.model.js";

@Entity()
@Check(`"availableQuantity" >= 0`)
@Entity('book')
@Index('idx_book_title_created', ['title', 'createdAt'])
@Index('idx_book_isbn_unique', ['ISBN'], { unique: true })
@Index('idx_book_author_fk', ['authorId'])
@Index('idx_book_created_desc', ['createdAt'])
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: "255" , unique:true})
  title: string;

  @Column({ type: "varchar", length: "20", unique: true })
  ISBN: string;

  @Column({ type: "int", default: 0 })
  availableQuantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "int" })
  authorId: number;

  @ManyToOne(() => Author, (author) => author.books, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId" }) // Ensures column name is authorId
  author: Author;
}
