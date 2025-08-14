import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { UserType } from "../constants.js";

@Entity()
@Index('idx_user_email_unique', ['email'], { unique: true })
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
