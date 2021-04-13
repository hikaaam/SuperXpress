import { Request, Response, NextFunction } from "express";
import * as moment from "moment";

const logger = (req: Request, res: Response, next: NextFunction) => {
  let date = moment().format("Y-MM-DD HH:mm:ss");
  let msg = "Accepted";
  let arr = req.ip.split(":");
  let ip = arr.pop();
  let url = req.url;
  console.log(`⚡️[request]: ${date} :: ${ip} :: ${msg} :: ${url}`);
  next();
};

export default logger;
