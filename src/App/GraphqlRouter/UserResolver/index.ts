import { Resolver, Query, Arg, FieldResolver, Root, Authorized } from 'type-graphql'
import { User } from '../../../Entity/User'
import { Like } from "typeorm";
import { Paginate } from '../../../Vendor';

@Resolver(of => User)
class UserResolver {

  @Authorized()
  @Query(() => [User])
  async Users(): Promise<User[]> {
    return await User.find();
  }

  @Authorized()
  @Query(() => User)
  async User(@Arg('id') id: number): Promise<User> {
    return await User.findOne(id);
  }

  @Authorized()
  @Query(() => [User])
  async UserPaginate(@Arg('page') page: number, @Arg('get') get: number): Promise<unknown> {
    return (await Paginate({
      get, page, entity: User,
    })).data;
  }

  @Authorized()
  @Query(() => [User])
  async UserSearch(@Arg('name') name: string): Promise<User[]> {
    return await User.find({
      where: {
        name: Like(`%${name}%`)
      }
    })
  }

}

export default UserResolver;
