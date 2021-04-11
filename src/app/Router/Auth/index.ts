import { Router, Request, Response, NextFunction } from "express";
import { AuthController } from "../../Controller";
const AuthRouter: Router = Router();
import resp from "../../Response";

AuthRouter.post(
  "/auth/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let resp = await AuthController.loginViaEmail(req.body);
      if (!resp.success) {
        res.status(400).json(resp);
        return;
      }
      res.json(resp);
    } catch (error) {
      res.status(500).json(resp(false, error.message, []));
    }
  }
);

AuthRouter.post(
  "/auth/sosial_login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let resp = await AuthController.loginViaSosial(req.body);
      if (!resp.success) {
        res.status(400).json(resp);
        return;
      }
      res.json(resp);
    } catch (error) {
      console.log("error happen here");
      return res.status(500).json(resp(false, error.message, []));
    }
  }
);

AuthRouter.post(
  "/auth/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let resp = await AuthController.register(req.body);
      if (!resp.success) {
        res.status(400).json(resp);
        return;
      }
      res.json(resp);
    } catch (error) {
      res.status(500).json(resp(false, error.message, []));
    }
  }
);

module.exports = AuthRouter;
