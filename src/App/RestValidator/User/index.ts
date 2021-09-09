import * as joi from 'joi'
import { Validator } from '../../../Vendor';
const {  joiPassword } = Validator;

export const userFillable = joiPassword.append({
  name: joi.string().min(10).max(100),
  email: joi.string().email(),
  picture: joi.string().uri(),
  firebase_token: joi.string().max(250),
});

export interface IuserFillable {
  name: string;
  email: string;
  picture: string;
  firebase_token: string;
  password: string;
}

export const adminUserFillable = userFillable.append({
  role: joi.string().valid("admin", "user"),
});

export interface IadminUserFillable extends IuserFillable {
  role: string;
}