// import "reflect-metadata";
import { getRepository } from "typeorm";
import { User } from "../../../entity/User";
import res from "../../Response";
import { NextFunction } from "express";

class UserController {
  constructor() {}

  static index = async () => {
    try {
      const data = await getRepository(User).find();
      return res(true, "success", data);
    } catch (error) {
      return res(false, error.message, []);
    }
  };

  static show = async (id: any) => {
    try {
      const data = await getRepository(User).findOneOrFail(id);
      return res(true, "success", data);
    } catch (error) {
      return res(false, error.message, []);
    }
  };

  static store = async (req: Object) => {
    try {
      console.log(req);
      const data = await getRepository(User).save(req);
      return res(true, "success", data);
    } catch (error) {
      return res(false, error.message, []);
    }
  };

  static update = async (id: any, req: Object) => {
    try {
      const data = await getRepository(User).update(id, req);
      return res(true, "success", data);
    } catch (error) {
      return res(false, error.message, []);
    }
  };

  static delete = async (id: any, req: Object) => {
    try {
      const data = await getRepository(User).delete(id);
      return res(true, "success", data);
    } catch (error) {
      return res(false, error.message, []);
    }
  };
}
export default UserController;
