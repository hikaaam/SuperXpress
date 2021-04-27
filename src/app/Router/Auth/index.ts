import { Router, Request, Response, NextFunction } from "express";
import { AuthController } from "../../Controller";
const AuthRouter: Router = Router();
import resp, { Err } from "../../Response";
import { passwordRegex, validate } from "../../Helper";
import { LoginViaEmail, RefreshToken, Sosial } from ".././../Validator/Auth";
import { userFillable } from ".././../Validator/User";

AuthRouter.post(
  "/auth/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(LoginViaEmail, req.body);
      let resp = await AuthController.loginViaEmail(req.body);
      if (!resp.success) {
        res.status(400).json(resp);
        return;
      }
      res.json(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

AuthRouter.post(
  "/auth/sosial_login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(Sosial, req.body);
      let resp = await AuthController.loginViaSosial(req.body);
      if (!resp.success) {
        res.status(400).json(resp);
        return;
      }
      res.json(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

AuthRouter.post(
  "/auth/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(userFillable, req.body);
      let resp = await AuthController.register(req.body);
      if (!resp.success) {
        res.status(400).json(resp);
        return;
      }
      res.json(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

AuthRouter.post(
  "/auth/refresh_token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(RefreshToken, req.body);
      let resp = await AuthController.refreshToken(req.body);
      if (!resp.success) {
        res.status(400).json(resp);
        return;
      }
      res.json(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

module.exports = AuthRouter;
