import { Database } from "../types/database.js";
import makeApp from "./app.js";

const getUser = () => {
  return "Roland";
};

const getUsers = () => {
  return ["Roland", "Mahalia", "Calypso"];
};

const db: Database = { getUser, getUsers };

makeApp(db);
