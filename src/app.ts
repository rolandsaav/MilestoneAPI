import express from "express";
export function makeApp(): express.Express {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Welcome to the jungle");
  });

  app.get("/test", (req, res) => {
    res.json(2);
  });

  return app;
}
