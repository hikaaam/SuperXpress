import * as joi from "joi";
import { passwordJoi } from "../../Helper";

export const userFillable = passwordJoi.append({
  name: joi.string().min(10).max(100),
  email: joi.string().email(),
  picture: joi.string().uri(),
  firebase_token: joi.string().max(250),
});

export const adminUserFillable = userFillable.append({
  role: joi.string().valid("admin", "user"),
});
