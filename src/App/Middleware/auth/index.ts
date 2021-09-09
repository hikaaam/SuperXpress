import { validateJWT, validateRefreshToken } from "../jwt";
import * as express from "express";
const dotenv = require("dotenv");
dotenv.config();

const isAuth: boolean = process.env.use_auth == "true";

export const guard = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!isAuth) {
      next();
    } else {
      if (!req.headers.authorization) {
        return res
          .status(401)
          .json({ success: false, msg: "No Authorization Header!", data: [] });
      }
      let arr = req.headers.authorization.split(" ");
      if (arr.length !== 2) {
        return res
          .status(401)
          .json({ success: false, msg: "Bearer not valid!", data: [] });
      }
      let jwt: string = arr[1];
      let response = await validateJWT(jwt);
      if (!response.success) {
        return res.status(401).json(response);
      }
      next();
    }
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, msg: "Not Authenticated!", data: [] });
  }
};
