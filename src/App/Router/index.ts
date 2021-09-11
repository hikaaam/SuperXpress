import { Router, Request, Response } from "express";
import resp from "../Response";
const fs = require("fs");
const path = require("path");
const router: Router = Router();
const userRouter: Router = require("./User");
const authRouter: Router = require("./Auth");
const uploadRouter: Router = require("./Upload");


router.get("/", (req: Request, res: Response) => {
  res.json({
    msg: "welcome"
  });
});
router.use("/", authRouter);
router.use("/", uploadRouter);
router.use("/", userRouter);
router.get("/images/:id", async (req: Request, res: Response) => {
  try {
    const image = req.params.id;
    if (!fs.existsSync("src/storage/images/" + image)) {
      res.status(404).json(resp(false, "file not found", null));
      return;
    }
    res.sendFile(path.resolve("src/storage/images/" + image));
  } catch (error) {
    res.status(500).json(resp(false, error.message, null));
  }
});

module.exports = router;
