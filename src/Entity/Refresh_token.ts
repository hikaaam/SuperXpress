import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("Refresh_token")
export class Refresh_token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 250,
  })
  secret_key: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
  @OneToOne(() => User, (user) => user.refresh_token, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user:User
}
