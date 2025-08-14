import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Book } from "./Book.model.js";

@Entity()
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