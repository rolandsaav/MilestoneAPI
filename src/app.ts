import express from "express";
import Database from "../types/database.js";
import UserRouter from "./routes/users.js";
import BodyParser from "body-parser";

export function makeApp(databse: Database): express.Express {
  const app = express();

  const userRouter = UserRouter(databse);

  app.use(BodyParser.urlencoded({ extended: false }));

  app.use("/users", userRouter);

  app.get("/", (req, res) => {
    res.send("Welcome to the jungle");
  });

  app.get("/test", (req, res) => {
    res.json(2);
  });

  return app;
}
