// import "reflect-metadata";
import { getRepository, Like } from "typeorm";
import { User } from "../../../entity/User";
import res from "../../Response";
import { NextFunction } from "express";
import { page } from "../../Validator/Paginator";
import { paginator } from "../../Helper";
import resp from "../../Response";

class UserController {
  constructor() {}

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
      let data = await paginator({
        get: 2,
        page,
        entity: User,
      });
      return resp(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static show = async (id: any) => {
    try {
      const data = await getRepository(User).findOneOrFail(id);
      return res(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static store = async (req: Object) => {
    try {
      console.log(req);
      const data = await getRepository(User).save(req);
      return res(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static update = async (id: any, req: Object) => {
    try {
      const data = await getRepository(User).update(id, req);
      return res(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static delete = async (id: any, req: Object) => {
    try {
      const data = await getRepository(User).delete(id);
      return res(true, "success", data);
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
export default UserController;
