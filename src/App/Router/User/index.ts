import { Router, Request, Response, NextFunction } from "express";
import controller from "../../Controllers/UserController";
import { Validator } from '../../../Vendor';
const { joiID, validate } = Validator;
import paginator from "../../RestValidator/Paginator";
import { Err } from "../../Response";
import { userFillable } from "../../RestValidator/User";

const userRouter: Router = Router();

userRouter.get(
  "/v1/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let resp: Object = await controller.index();
      res.json(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

userRouter.get(
  "/v1/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(joiID, req.params);
      const { id } = req.params;
      let resp: Object = await controller.show(id);
      res.json(resp);
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
      let resp: Object = await controller.paginate(Number(page));
      res.json(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);


userRouter.put(
  "/v1/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(joiID, req.params);
      const { id } = req.params;
      validate(userFillable, req.body);
      const { body } = req;
      let resp: Object = await controller.update(id, body);
      res.json(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

userRouter.delete(
  "/v1/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(joiID, req.params);
      const { id } = req.params;
      validate(userFillable, req.body);
      const { body } = req;
      let resp: Object = await controller.delete(id, body);
      res.json(resp);
    } catch (error) {
      res.status(400).json(Err(error.message));
    }
  }
);

module.exports = userRouter;
