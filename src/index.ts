import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
import { makeJWT, guard, err404, invalidJson } from "./app/Middleware";

createConnection()
  .then(async (connection) => {
    const app = express();
    const router: express.Router = require("./app/Router");
    const PORT = process.env.host;

    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use("/v1", guard);
    app.use(invalidJson);
    app.use("/", router);
    app.use("*", err404);
    app.listen(PORT, () => {
      console.log(
        `⚡️[server]: Server is running at https://localhost:${PORT}`
      );
    });
  })
  .catch((error) => console.log(error));
