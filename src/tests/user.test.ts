import { describe } from "mocha";
import request from "supertest";
import app from "../server.js";

describe("Users", () => {
  describe("GET /users", () => {
    it("Should return all users in the database", async () => {
      const response = await request(app).get("/users");
    });
  });
});
