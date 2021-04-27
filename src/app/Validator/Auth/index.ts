import * as joi from "joi";
import { string } from "joi";
import { passwordJoi } from "../../Helper";

export const LoginViaEmail = passwordJoi.append({
  email: string().email().required(),
});

export const Sosial = joi.object({
  sosial_token: string().required(),
  password: string().required(),
  name: string().min(10).max(100),
  picture: string().uri(),
  firebase_token: string().required(),
});

export const RefreshToken = joi.object({
  clientSecret: string().required(),
  refreshToken: string().required(),
});

export const userRegister = passwordJoi.append({
  name: string().required(),
  email: string().required(),
  picture: string().uri(),
  firebase_token: string().required(),
});
