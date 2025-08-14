import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserType } from "../constants.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "varchar", length: "100" })
  username: string;
  @Column({ type: "varchar", length: "100", unique:true })
  email: string;
  @Column({ type: "varchar", length: "100" })
  password: string;
   @Column({
    type: "enum",
    enum: UserType,
    default: UserType.USER // Default role
  })
  userType: UserType;
}
