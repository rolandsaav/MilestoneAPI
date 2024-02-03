import express from "express";
import dotenv from "dotenv";
dotenv.config();
import UserRouter from "./routes/users.js";
import GoalRouter from "./routes/goals.js";
import bodyParser from "body-parser";
import { Express } from "express";
import fileUpload from "express-fileupload";

export default function makeApp(): Express {
    const app = express();
    app.use(fileUpload());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.json());

    app.use("/users", UserRouter);
    app.use("/goals", GoalRouter);

    app.get("/", (req, res) => {
        res.send("Welcome to the jungle!");
    });

    return app;
}
