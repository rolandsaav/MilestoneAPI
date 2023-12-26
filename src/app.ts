import express from "express";
export function makeApp(): void {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Welcome to the jungle");
  });

  app.listen(3000, () => {
    console.log("App listening on port 3000");
  });
}
