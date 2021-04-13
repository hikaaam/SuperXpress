import * as express from "express";
import resp from "../../Response";

export const err404 = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.route) {
    return res.status(404).json(resp(false, "Route not found", null));
  }
  next();
};

export const invalidJson = (err, req, res, next) => {
  console.error(err);
  if (err.status === 400)
    return res.status(err.status).json(resp(false, "Invalid JSON", null));
  return next(err);
};
