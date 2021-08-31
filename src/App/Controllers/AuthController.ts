import { getRepository } from "typeorm";
import { User } from "../../Entity/User";
import { Refresh_token } from "../../Entity/Refresh_token";
import res from "../Response";
import {
  makeJWT,
  makeRefreshToken,
  clientSecretGenerator,
  validateRefreshToken,
} from "../Middleware";
import { validate } from "class-validator";
import { Crypt } from '../../Vendor'
const { hash } = Crypt;

interface register_sosial {
  sosial_token: string;
  picture?: string;
  role?: string;
  name: string;
  firebase_token: string;
}

class AuthController {
  constructor() { }

  static loginViaEmail = async (req: any) => {
    try {
      let password = hash(req.password);

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
        let token = await generateToken(data);
        return res(true, "login success", token);
      }
      return res(false, "login failed", []);
    } catch (error) {
      return res(false, error.message, []);
    }
  };

  static loginViaSosial = async (req: register_sosial) => {
    try {
      let user = new User();
      user.sosial_token = req.sosial_token;
      user.password = req.sosial_token;
      user.picture = req.picture;
      user.role = "user";
      user.name = req.name;
      user.firebase_token = req.firebase_token;

      const err: any = await validate(user);
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
      let token = await generateToken(data);
      return res(true, "login success", token);
    } catch (error) {
      return res(false, error.message, []);
    }
  };


  static register = async (req: any) => {
    try {
      let password = hash(req.password);
      let user = new User();
      user.email = req.email;
      user.password = password;
      user.role = "user";
      user.name = req.name;
      user.firebase_token = req.firebase_token;

      const err = await validate(user);
      if (err.length > 0) {
        let msg = getErr(err);
        return res(false, msg, err);
      }
      let data = await getRepository(User).save(user);
      let token = await generateToken(data);
      return res(true, "login success", token);
    } catch (error) {
      return res(false, error.message, []);
    }
  };

  static refreshToken = async (req: any) => {
    try {
      if (req.client_secret == null && req.refresh_token == null) {
        return res(false, "clientSecret and refreshToken is required", null);
      }

      let clientSecret = req.client_secret;
      let refreshToken = req.refresh_token;

      let validation = await validateRefreshToken(refreshToken, clientSecret);

      if (!validation.success) {
        return validation;
      }

      let token = makeJWT({
        id: validation.data.id,
        role: validation.data.role,
      });

      return res(true, "here is your new token", {
        token,
      });
    } catch (error) {
      return res(false, error.message, []);
    }
  };
}
export default AuthController;

const getErr = (err: any): string => {
  let err_: any = Object.values(err[0]);
  let errlength = err_.length - 1;
  let data: any = Object.values(err_[errlength]);
  let msg = data[0];
  return msg;
};

const generateToken = async (user: User) => {
  let jwt: string = makeJWT({ id: user.id, role: user.role });
  let clientSecret: string = clientSecretGenerator();
  let refreshToken: string = makeRefreshToken(clientSecret);
  let hashedClient: string = hash(clientSecret);
  let getOne = await getRepository(Refresh_token).find({
    where: {
      user,
    },
  });

  if (getOne.length < 1) {
    getRepository(Refresh_token).save({
      secret_key: hashedClient,
      user,
    });
  } else {
    let refresh = new Refresh_token();
    refresh.user = user;
    refresh.secret_key = hashedClient;
    getRepository(Refresh_token).update(getOne[0].id, refresh);
  }

  return {
    token: jwt,
    refreshToken,
    clientSecret,
  };
};
