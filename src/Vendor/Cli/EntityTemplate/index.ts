export const generateEntity = (name: string) => {
    return `//generated by cli
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity({name:"${name}"})
export class ${name} extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({
    length: 100,
    })
    name: string;

    @Field()
    @CreateDateColumn()
    created_at: Date;

    @Field()
    @UpdateDateColumn()
    updated_at: Date;
    
}
`
}