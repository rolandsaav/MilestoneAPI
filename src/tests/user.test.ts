import request from "supertest";
import { User } from "../types/User.js";
import makeApp from "../app.js";
import { Express } from "express";

let server: Express = null;

beforeAll((done) => {
  server = makeApp();
  done();
});
test("/users should return an array of all users", async () => {
  const response = await request(server).get("/users");
  const users: User[] = response.body;
  expect(users.length).toBeGreaterThan(1);
  console.log(users);
});
