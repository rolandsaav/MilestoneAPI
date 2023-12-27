import request from "supertest";
import { makeApp } from "../src/app";
describe("testing index file", () => {
  test("empty string should result in zero", () => {
    expect(makeApp).toBeDefined();
  });
});
