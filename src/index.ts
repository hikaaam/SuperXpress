import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { graphqlHTTP } from "express-graphql";
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
import { guard, err404, invalidJson, logger } from "./App/Middleware";
import GraphqlRouter from './App/GraphqlRouter';
import ColorLog from './Vendor/ColorLog';
const expressPlayground = require('graphql-playground-middleware-express').default
createConnection()
  .then(async () => {
    const app = express();
    const router: express.Router = require("./App/Router");
    const PORT = process.env.host;
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(__dirname + "/app/storage/images"));
    app.use(cors());
    app.use(logger);
    app.use("/v1", guard);
    const schema = await GraphqlRouter;
    app.get('/playground', expressPlayground({ endpoint: '/graphql' }))
    app.use('/graphql', graphqlHTTP((req) => ({
      schema: schema,
      rootValue: schema,
      graphiql: true,
      context: req.headers,
    })
    ));
    app.use(invalidJson);
    app.use("/", router);
    app.use("*", err404);
    app.listen(PORT, () => {
      console.log(
        ColorLog.FgGreen, `⚡️[server]: Server is running at ${ColorLog.FgMagenta} http://localhost:${PORT}\n`
      );
      console.log(
        ColorLog.FgGreen, `⚡️[server]: Graphql Server is running at ${ColorLog.FgMagenta} http://localhost:${PORT}/graphql\n`
      )
      console.log(
        ColorLog.FgGreen, `⚡️[server]: GraphqlPlayground start at ${ColorLog.FgMagenta} http://localhost:${PORT}/playground\n`
      )
    });
  })
  .catch((error) => console.log(error));
