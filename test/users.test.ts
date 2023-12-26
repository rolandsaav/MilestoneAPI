import request from "supertest";
import makeApp from "../src/app.ts";
import { jest } from "@jest/globals";

const app = makeApp({
  getUsers: function () {
    return ["Roland", "Mahalia", "Calypso"];
  },
  getUser: function () {
    return "Roland";
  },
});

describe("Initial dependency injection testing", () => {
  test("Get users should return some json", async () => {
    const result = await request(app).get("/users");
    expect(result);
  });
});
