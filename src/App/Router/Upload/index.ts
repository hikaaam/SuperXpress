import { Request, Response, Router, NextFunction } from "express";
import * as moment from "moment";
const UploadRouter: Router = Router();
import resp from "../../Response";
import { clientSecretGenerator } from "../../Middleware";

import * as multer from "multer";

UploadRouter.post(
  "/v1/upload",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      upload(req, res, (err) => {
        if (err) {
          res.status(500).json(
            resp(false, err.message, {
              format: ["jpg", "png", "webp", "gif", "jpeg"],
              maxSize: 350000 / 1000 + "KB",
            })
          );
          return;
        }
        res.json(
          resp(true, "Upload Success", {
            file: req.file.filename,
          })
        );
      });
    } catch (error) {
      res.status(500).json(resp(false, error.message, null));
    }
  }
);

const filename = `${clientSecretGenerator()}${clientSecretGenerator()}${moment().unix()}`;

const upload = multer({
  limits: {
    fileSize: 350000, //filesize in bytes 350kb default
  },
  storage: multer.diskStorage({
    destination: "src/storage/images",
    filename: (req, file, cb) => {
      let ext = file.originalname.split(".").pop();
      cb(null, `${filename}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    let ext = file.originalname.split(".").pop();
    if (
      ext != "jpg" &&
      ext != "png" &&
      ext != "webp" &&
      ext != "gif" &&
      ext != "jpeg"
    ) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
}).single("image");

module.exports = UploadRouter;
