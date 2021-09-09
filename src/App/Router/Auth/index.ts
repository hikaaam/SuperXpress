import { Router, Request, Response, NextFunction } from "express";
import controller from "../../Controllers/AuthController";
const AuthRouter: Router = Router();
import { Err } from "../../Response";
import { LoginViaEmail, RefreshToken, Sosial } from "../../RestValidator/Auth";
import { userFillable } from "../../RestValidator/User";
import { Validator } from '../../../Vendor';
const { validate } = Validator;

AuthRouter.post(
  "/auth/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(LoginViaEmail, req.body);
      let resp = await controller.loginViaEmail(req.body);
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
      let resp = await controller.loginViaSosial(req.body);
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
      let resp = await controller.register(req.body);
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
      let resp = await controller.refreshToken(req.body);
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
