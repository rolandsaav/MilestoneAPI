import request from "supertest";
import { makeApp } from "../src/app";
describe("testing index file", () => {
  test("empty string should result in zero", () => {
    expect(makeApp).toBeDefined();
  });

  test("test endpoint returns 2", async () => {
    const result = await request(makeApp()).get("/test");
    expect(result.body).toBe(2);
  });
});
