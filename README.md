# Welcome to Super Xpress

This template provide you a ready to use express REST APIs and Graphql.

## Features

- ##### Graphql
- ##### Rest APIs
- ##### TypeOrm
- ##### JWT Authentications
- ##### Joi Validator
- ##### CLI
- ##### Basic Middleware (logger, cors, jwt, file uploads )
- ##### Lodash for basic developer function, and basic Cryptography function

## Instalations

Steps to run this project:

1. run `git clone https://github.com/hikaaam/SuperXpress.git`
2. Run `yarn install` command
3. Setup database settings inside `ormconfig.json` file
4. Copy .envexample to .env
5. Run `yarn start` command

## CLI

Cli provided for you to generate controller, entity, validator, and router

#### `yarn run make`

This command will show you an options what you want to generate

If you generate `Entity`, the `GraphqlResolver` will also generated
but you need to register your resolver on the `GraphqlRouter/index.ts`

```typescript
import YourResolver from "./YourResolver";
/* ... */
export default buildSchema({
  resolvers: [
    UserResolver,
    YourSesolver, //put it here
  ],
  /* ... */
});
```

and if you generate a `Router` you also need to register on `Route/intex/ts`

```typescript
const yourRouter: Router = require("./Your");
/*...*/
router.use("/", yourRouter);
```

## Entity

Entity is defined database model that automatically synced everytime you made a change

#### Setting up Entity

Example of entity

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from "typeorm";
import { ObjectType, Field, Int } from 'type-graphql';

@Entity("Users")
@ObjectType()
export class User extends BaseEntity {

@PrimaryGeneratedColumn() //your column type (a primary key id)
@Field(() => Int) //graphql field return as integer
  id: number; //your column name
}

@Column({ //to register it as a column in the database
  length: 100,
})
@Field() //graphql field return as a string (default is a string)
  name: string; //your column name

}
```

#### `Entity('name')`

This one is what your table name gonna be

#### `ObjectType()`

This one is a graphql function to translate your typeorm schema into readable graphql schema

#### `Column()`

To define a column in the database and make typeorm understand that this is a column

#### `Field()`

Field is to make graphql understand what you written below its a registered column on the database

#### Entity UseCase

- `find()`

```typescript
User.find({
  where: [
    {
      name: "john doe",
    },
  ],
});
//is the same as SELECT * FROM USER WHERE name = 'john doe'
```

- `findOne();`

```typescript
User.findOne(1);
//is the same as SELECT * FROM USER WHERE id = 1;
```

Other usecase you can find the example on [Typeorm Docs](https://typeorm.io)

### Relations

- Entity

User Entity

```typescript
import { Book } from "./Book";
import { OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Field } from "type-graphql";
/* ... */
@Entity("Users")
@ObjectType()
export class User extends BaseEntity {
  /* ... */
  //Example of one to many relation author to books
  @OneToMany(() => Book, books => books.User)
  @JoinColumn()
  @Field(() => [Book]) //this one to tell grapqhl a books field return array of book 
  // (you need FieldResolver in order for it to work)
  books: Book[];
}
```

Book Entity

```typescript
import { User } from "./User";
import { OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Field } from "type-graphql";
/* ... */
@Entity("Books")
@ObjectType()
export class Book extends BaseEntity {
  /* ... */
  //Example of many to one relation books to author
  @ManyToOne(() => User, author => author.Books)
  @JoinColumn()
  @Field(() => User) //this one to tell grapqhl an author field return User
  author: User;
}
```

Typeorm Usage
```typescript
const users = await User.find({ relations: ["books"] });
```
Author FieldResolver on BookResolver
```typescript
import {FieldResolver, Root } from 'type-graphql';
import {User} from './User';
/*...*/
@Resolver(of => Book)
class BookResolver {
/*...*/

@FieldResolver()
author(@Root() book: Book) {
  return User.findOne({
    cache: 1000,
    where: { author: { id: book.author.id } },
  });
}
```

Books FieldResolver on UserResolver
```typescript
import {FieldResolver, Root } from 'type-graphql';
import {Book} from './Book';
/*...*/
@Resolver(of => User)
class UserResolver {
/*...*/

@FieldResolver()
books(@Root() user: User) {
  return Book.find({
    cache: 1000,
    where: { author: { id: author.id } },
  });
}
```

field

for other example on relation you can find it on [Typeorm/Relations](https://typeorm.io/#/relations)

## Others
```typescript
import {Crypt} from '../../../Vendor';

//a hash function (sha256)
const hashedText = Crypt.hash('plaintext');
//an encrypt functions (AES)
const encryptedText = Crypt.encrypt('plaintext','yoursuperstrongkey');
const decryptedText = Crypt.decrypt('plaintext','yoursuperstrongkey');
```
