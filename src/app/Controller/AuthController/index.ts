// import "reflect-metadata";
import { getRepository } from "typeorm";
import { User } from "../../../entity/User";
import res from "../../Response";
import {
  makeJWT,
  makeRefreshToken,
  clientSecretGenerator,
} from "../../Middleware";
import * as Crypto from "crypto-js";
import { Length, validate } from "class-validator";

class AuthController {
  constructor() {}

  static loginViaEmail = async (req: any) => {
    try {
      if (req.email == null) {
        return res(false, "email is required", []);
      }

      if (req.password == null) {
        return res(false, "password is required", []);
      }

      let response = passwordHashing(req.password, true);

      if (!response.success) {
        return response;
      }

      let password = response.data;

      const data = await getRepository(User)
        .createQueryBuilder()
        .where("email =:email", { email: req.email })
        .andWhere("password =:password", { password })
        .getOne();

      if (data) {
        if (req.email != data.email) {
          return res(false, "wrong email", []);
        }

        if (password != data.password) {
          return res(false, "wrong password", []);
        }

        let jwt: string = makeJWT({ id: data.id, role: data.role });
        let clientSecret: string = clientSecretGenerator();
        let refreshToken: string = makeRefreshToken(clientSecret);
        return res(true, "login success", {
          token: jwt,
          clientSecret,
          refreshToken,
        });
      }
      return res(false, "login failed", []);
    } catch (error) {
      return res(false, error.message, []);
    }
  };

  static loginViaSosial = async (req: any) => {
    try {
      let user = new User();
      user.sosial_token = req.sosial_token;
      user.password = req.sosial_token;
      user.picture = req.picture;
      user.role = "user";
      user.name = req.name;
      user.firebase_token = req.firebase_token;

      const err: any = await validate(user);
      console.log(err);
      if (err.length > 0) {
        let props = err[0].property;
        if (props !== "email") {
          let msg = getErr(err);
          return res(false, msg, err);
        }
      }

      let getOne = await getRepository(User)
        .createQueryBuilder()
        .where("firebase_token = :fb_token", { fb_token: user.firebase_token })
        .orWhere("sosial_token = :s_token", { s_token: user.sosial_token })
        .getOne();

      if (getOne) {
        let data = await getRepository(User).update(getOne.id, user);
        let jwt: string = makeJWT({ id: getOne.id, role: getOne.role });
        let clientSecret: string = clientSecretGenerator();
        let refreshToken: string = makeRefreshToken(clientSecret);
        return res(true, "login success", {
          token: jwt,
          clientSecret,
          refreshToken,
        });
      }
      let data = await getRepository(User).save(user);
      let jwt: string = makeJWT({ id: data.id, role: data.role });
      let clientSecret: string = clientSecretGenerator();
      let refreshToken: string = makeRefreshToken(clientSecret);
      return res(true, "login success", {
        token: jwt,
        clientSecret,
        refreshToken,
      });
    } catch (error) {
      return res(false, error.message, []);
    }
  };

  static register = async (req: any) => {
    try {
      if (req.email == null) {
        return res(false, "email is required", []);
      }

      let response = passwordHashing(req.password, true);

      if (!response.success) {
        return response;
      }

      let password = response.data;

      let user = new User();
      user.email = req.email;
      user.password = password;
      user.role = "user";
      user.name = req.name;
      user.firebase_token = req.firebase_token;

      const err = await validate(user);
      console.log(err);
      if (err.length > 0) {
        let msg = getErr(err);
        return res(false, msg, err);
      }
      let data = await getRepository(User).save(user);
      let jwt: string = makeJWT({ id: data.id, role: data.role });
      let clientSecret: string = clientSecretGenerator();
      let refreshToken: string = makeRefreshToken(clientSecret);
      return res(true, "login success", {
        token: jwt,
        clientSecret,
        refreshToken,
      });
    } catch (error) {
      return res(false, error.message, []);
    }
  };
}
export default AuthController;

const passwordHashing = (password: string, isLogin: boolean = false) => {
  let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  let validation = reg.test(password);

  if (!validation) {
    var msg = "Wrong Password";
    if (isLogin) {
      msg = "Password must contain atleast 8 character and a number";
    }
    return res(false, msg, []);
  }

  return res(true, "success hashing", Crypto.SHA256(password).toString());
};

const getErr = (err: any) => {
  let err_: any = Object.values(err[0]);
  let errlength = err_.length - 1;
  let data: any = Object.values(err_[errlength]);
  let msg = data[0];
  return msg;
};
