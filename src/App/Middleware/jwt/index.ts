import {Crypt} from '../../../Vendor'
import * as Crypto from "crypto-js";
import * as base64 from "js-base64";
import * as moment from "moment";
const dotenv = require("dotenv");
dotenv.config();
import resp from "../../Response";
import { getRepository } from "typeorm";
import { Refresh_token } from "../../../Entity/Refresh_token";


const secret_: any = process.env.jwt_secret;
const duration: string = process.env.jwt_duration_days;
const secret: string = Crypto.SHA256(secret_).toString();
export const makeJWT = (payload: Object) => {
  let header: object = { alg: "SSE2+HS256", typ: "JWT" };
  let base64header: string = base64.encodeURI(JSON.stringify(header));
  let base64payload: string = makeJWTBody(payload);
  let signature: string = Crypto.HmacSHA256(
    base64header + secret + base64payload,
    secret
  ).toString();
  return `${base64header}.${base64payload}.${signature}`;
};

export const validateJWT = (jwt: string) => {
  const useauth = process?.env?.use_auth ?? "true";
  if(useauth=="false") return resp(true,"backend deactivate their auth",null)
  let arr = jwt.split(".");
  if (arr.length !== 3) {
    return resp(false, "Token is not valid", null);
  }

  let head: string = arr[0];
  let pload: string = arr[1];
  let sign: string = arr[2];
  let signature: string = Crypto.HmacSHA256(
    head + secret + pload,
    secret
  ).toString();
  if (sign === signature) {
    let currDate: number = moment().unix();
    let pload_: any = JSON.parse(base64.decode(pload));
    let exp: number = pload_.exp;

    if (moment.unix(currDate).isAfter(moment.unix(exp))) {
      return resp(false, "Token Expired", {
        ...pload_,
        exp: moment.unix(exp).format("Y-MM-DD HH:mm:ss"),
      });
    }

    return resp(
      true,
      `Token valid until ${moment.unix(exp).format("Y-MM-DD HH:mm:s")}`,
      pload_
    );
  }

  return resp(false, "Token is not valid!", null);
};

export const makeRefreshToken = (clientSecret: string) => {
  let base64header: string = makeRefreshHeader(clientSecret);
  let signature: string = makeRefreshSignature(base64header);
  return `${base64header}.${signature}`;
};

export const validateRefreshToken = async (
  refreshToken: string,
  clientSecret: string
) => {
  try {
    let arr = refreshToken.split(".");
    if (arr.length !== 2) {
      return resp(false, "Refresh token is not valid!", null);
    }
    let base64header: string = arr[0];
    let signature: string = arr[1];

    let hashedSecret = Crypt.hash(clientSecret);
    let getOne = await getRepository(Refresh_token).findOne({
      relations: ["user"],
      where: {
        secret_key: hashedSecret,
      },
    });
    if (getOne.secret_key !== hashedSecret) {
      return resp(false, "Refresh token is not valid!", null);
    }

    let clientbase64header: string = makeRefreshHeader(clientSecret);
    if (base64header !== clientbase64header) {
      return resp(false, "Refresh token is not valid!", null);
    }
    let clientsignature: string = makeRefreshSignature(clientbase64header);
    if (signature !== clientsignature) {
      return resp(false, "Refresh token is not valid!", null);
    }

    return resp(true, "Refresh token valid!", getOne.user);
  } catch (error) {
    return resp(false, "Refresh token is not valid!", null);
  }
};

const makeRefreshHeader = (clientSecret: string) => {
  let refreshId: string = Crypto.SHA256(clientSecret).toString();
  let header: object = { refreshId };
  let base64header: string = base64.encodeURI(JSON.stringify(header));
  return base64header;
};
const makeRefreshSignature = (base64header: string) => {
  let signature: string = Crypto.HmacSHA256(
    `${secret}.${base64header}`,
    secret
  ).toString();
  return signature;
};

const makeJWTBody = (payload) => {
  let currDate: number = moment().add(duration, "days").unix();
  payload = { ...payload, exp: currDate };
  let base64payload: string = base64.encodeURI(JSON.stringify(payload));
  return base64payload;
};

export const clientSecretGenerator = () => {
  let max: number = 999999;
  let min: number = 111111;
  let random: number = Math.round(Math.random() * (max - min + 1) + min);
  let timestamp: number = moment().unix();
  let firstThreeRandom: string = random.toString().substr(0, 3);
  let lastThreeRandom: string = random.toString().substr(4, 6);
  let cs: string = `${firstThreeRandom}${timestamp}${lastThreeRandom}`;
  return base64.encodeURI(cs);
};
