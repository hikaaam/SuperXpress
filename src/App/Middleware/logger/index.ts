import { Request, Response, NextFunction } from "express";
import * as moment from "moment";

const logger = (req: Request, res: Response, next: NextFunction) => {
  let date = moment().format("Y-MM-DD HH:mm:ss");
  let arr = req.ip.split(":");
  let ip = arr.pop();
  console.log(
    `⚡️[request]: ${date} :: IP ${ip} :: Accepted :: ${req.method} ${req.url}`
  );
  res.on("finish", () => {
    let date = moment().format("Y-MM-DD HH:mm:ss");
    console.log(
      `⚡️[response]: ${date} :: IP ${ip} :: ${res.statusCode} ${res.statusMessage} :: ${req.method} ${req.url}`
    );
  });
  next();
};

export default logger;
