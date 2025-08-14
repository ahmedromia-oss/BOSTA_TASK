import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from "typeorm";
import { Book } from "./Book.model.js";

@Entity()
@Index('idx_author_name_created', ['name', 'createdAt'])
export class Author {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Book, book => book.author)
  books: Book[];

  @Column({ type: "varchar", length: "255", unique:true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}