import request from "supertest";
import makeApp from "../app.js";
import { Express } from "express";

let server: Express = null;

beforeAll((done) => {
    server = makeApp();
    done();
});

describe("Tests for Creating Users endpoint", () => {
    test("Creating a users without an email fails", async () => {
        const response = await request(server)
            .post("/users/create")
            .send({ username: "Username", email: "" });
        expect(response.status).toBe(400);
    });
    test("Creating a user without a username fails", async () => {
        const response = await request(server)
            .post("/users/create")
            .send({ username: "", email: "email@gmail.com" });
        expect(response.status).toBe(400);
    });
});
