import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../../Controller";
import * as joi from "joi";
import { ID, validate } from "../../Helper";
import paginator from "../../Validator/Paginator";
import { Err } from "../../Response";
import { userFillable, adminUserFillable } from "../../Validator/User";

const userRouter: Router = Router();

userRouter.get(
  "/v1/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let resp: Object = await UserController.index();
      res.send(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

userRouter.get(
  "/v1/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(ID, req.params);
      const { id } = req.params;
      let resp: Object = await UserController.show(id);
      res.send(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

userRouter.get(
  "/v1/user/page/:page",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(paginator, req.params);
      const { page } = req.params;
      let resp: Object = await UserController.paginate(Number(page));
      res.send(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

// userRouter.post(
//   "/v1/user",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { body } = req;
//       console.log(body);
//       let resp: Object = await UserController.store(body);
//       res.send(resp);
//     } catch (error) {
//       res.status(400).json(Err(error.message));
//     }
//   }
// );

userRouter.put(
  "/v1/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(ID, req.params);
      const { id } = req.params;
      validate(userFillable, req.body);
      const { body } = req;
      let resp: Object = await UserController.update(id, body);
      res.send(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

userRouter.delete(
  "/v1/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(ID, req.params);
      const { id } = req.params;
      validate(userFillable, req.body);
      const { body } = req;
      let resp: Object = await UserController.delete(id, body);
      res.send(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

module.exports = userRouter;
