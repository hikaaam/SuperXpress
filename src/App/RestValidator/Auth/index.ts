import * as joi from 'joi'
import { Validator } from '../../../Vendor';
const { joiPassword } = Validator;

export const LoginViaEmail = joiPassword.append({
  email: joi.string().email().required(),
});

export const Sosial = joi.object({
  sosial_token: joi.string().required(),
  password: joi.string().required(),
  name: joi.string().min(10).max(100).required(),
  picture: joi.string().uri(),
  firebase_token: joi.string().required(),
});

export const RefreshToken = joi.object({
  client_secret: joi.string().required(),
  refresh_token: joi.string().required(),
});

export const userRegister = joiPassword.append({
  name: joi.string().required(),
  email: joi.string().required(),
  picture: joi.string().uri(),
  firebase_token: joi.string().required(),
});
