import makeApp from "./app.js";

const app = makeApp();
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
