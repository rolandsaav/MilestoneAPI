import express from "express";
import Database from "../../types/database.js";

export default function UserRouter(database: Database): express.RequestHandler {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const users = await database.getUsers();
    res.json(users);
  });

  router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await database.getUser(id);
    res.json(user);
  });

  return router;
}
