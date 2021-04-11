import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../../Controller";
const userRouter: Router = Router();

userRouter.get(
  "/v1/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let resp: Object = await UserController.index();
      res.send(resp);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get(
  "/v1/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let resp: Object = await UserController.show(id);
      res.send(resp);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/v1/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      console.log(body);
      let resp: Object = await UserController.store(body);
      res.send(resp);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.put(
  "/v1/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { body } = req;
      let resp: Object = await UserController.update(id, body);
      res.send(resp);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.delete(
  "/v1/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { body } = req;
      let resp: Object = await UserController.delete(id, body);
      res.send(resp);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
