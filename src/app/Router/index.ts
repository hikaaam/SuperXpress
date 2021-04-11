import { Router, Request, Response } from "express";
const router: Router = Router();
const userRouter: Router = require("./User");
const authRouter: Router = require("./Auth");

router.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});
router.use("/", authRouter);
router.use("/", userRouter);

module.exports = router;
