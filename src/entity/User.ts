import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
export type userRoles = "admin" | "user";
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity("Users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: userRoles;

  @Column({
    length: 100,
    unique: true,
    nullable: true,
  })
  @IsEmail()
  email: string;

  @Column({
    length: 250,
  })
  password: string;

  @Column({
    length: 250,
    nullable: true,
  })
  picture: string;

  @Column({
    length: 250,
    unique: true,
  })
  firebase_token: string;

  @Column({
    length: 250,
    unique: true,
    nullable: true,
  })
  sosial_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
