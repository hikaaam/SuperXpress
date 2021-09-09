import { Refresh_token } from './Refresh_token';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  BaseEntity,
  JoinColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
import { ObjectType, Field, Int } from 'type-graphql';
export type userRoles = "admin" | "user";
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity("Users")
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({
    length: 100,
  })
  @Field()
  name: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  @Field()
  role: userRoles;

  @Column({
    length: 100,
    unique: true,
    nullable: true,
  })
  @IsEmail()
  @Field()
  email: string;

  @Column({
    length: 250,
  })
  @Field()
  password: string;

  @Column({
    length: 250,
    nullable: true,
  })
  @Field()
  picture: string;

  @Column({
    length: 250,
    unique: true,
    nullable: true,
  })
  @Field()
  firebase_token: string;

  @Column({
    length: 250,
    unique: true,
    nullable: true,
  })
  @Field()
  sosial_token: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @OneToOne(() => Refresh_token, refresh_token => refresh_token.user)
  refresh_token: Refresh_token;

}
