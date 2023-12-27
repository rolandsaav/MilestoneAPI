import request from "supertest";
import { makeApp } from "../src/app";

const getUsers = jest.fn();
const getUser = jest.fn();

const app = makeApp({ getUsers, getUser });

describe("Testing the user router", () => {
  test("Getting /users should return an array of 3 users", async () => {
    getUsers.mockReturnValue(["Roland", "Nikola", "Chan"]);
    const response = await request(app).get("/users");
    expect(getUsers.mock.calls.length).toBe(1);
    expect(response.body).toHaveLength(3);
  });
});
