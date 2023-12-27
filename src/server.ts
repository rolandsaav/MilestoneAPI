import { makeApp } from "./app.js";

const app = makeApp();

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
