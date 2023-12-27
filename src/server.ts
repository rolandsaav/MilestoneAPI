import { makeApp } from "./app.js";

const getUsers = () => {
  return ["Roland", "Mahalia", "Nikola"];
};

const getUser = (id: number) => {
  const users = ["Roland", "Mahalia", "Nikola"];
  return users[id];
};

const app = makeApp({ getUsers, getUser });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
