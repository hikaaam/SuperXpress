import { getRepository } from "typeorm";
import { User } from "../../Entity/User";
import res from "../Response";
import { IuserFillable } from "../RestValidator/User";
import { Paginate, _id } from '../../Vendor'
import resp from "../Response";

class UserController {
  constructor() { }

  static index = async () => {
    try {
      const data = await getRepository(User).find();
      return res(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static paginate = async (page: number) => {
    try {
      let data = await Paginate({
        get: 2,
        page,
        entity: User,
      });
      return resp(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static show = async (id: _id) => {
    try {
      const data = await getRepository(User).findOneOrFail(id);
      return res(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static store = async (req: IuserFillable) => {
    try {
      console.log(req);
      const data = await getRepository(User).save(req);
      return res(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static update = async (id: _id, req: IuserFillable) => {
    try {
      const data = await getRepository(User).update(id, req);
      return res(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static delete = async (id: _id, req: IuserFillable) => {
    try {
      const data = await getRepository(User).delete(id);
      return res(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
export default UserController;
