import makeApp from "./app.js";
import { Database } from "./types/database.js";

const getUser = () => {
  return "Roland";
};

const getUsers = () => {
  return ["Roland", "Mahalia", "Calypso"];
};

const db: Database = { getUser, getUsers };

makeApp(db);
