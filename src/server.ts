import express from "express";
import dotenv from "dotenv";
dotenv.config();
import UserRouter from "./routes/users.js";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", UserRouter);

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
app.get("/", (req, res) => {
  res.send("Welcome to the jungle!");
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
