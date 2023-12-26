import express from "express";
import { Database } from "../types/database.js";

export default function (database: Database) {
  const router = express.Router();

  router.get("/", (req, res) => {
    const users = database.getUsers();
    res.json(users);
  });

  router.get("/test", (req, res) => {
    const user = database.getUser();
    res.json({ name: user });
  });

  return router;
}
