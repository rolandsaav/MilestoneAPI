import express from "express";
import userRouter from "./routes/users.js";
import { Database } from "./types/database.js";

export default function makeApp(database: Database) {
  const app = express();
  const userRoute = userRouter(database);

  app.use("/users", userRoute);

  app.get("/", (req, res) => {
    res.send("Welcome to the jungle!");
  });

  app.listen(3000, () => {
    console.log(`Listening on port 3000!`);
  });
}
