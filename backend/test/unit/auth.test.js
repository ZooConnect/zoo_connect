import request from "supertest";
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from "vitest"; // Added hooks
import mongoose from "mongoose";

import app from "../../src/app.js";
import { connectDB } from "../../src/db/mongoDB.js";
import User from "../../src/models/user.model.js";

const userName = "test";
const userEmail = "test@gmail.com";
const userPassword = "Password123!";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST /api/auth/signup", () => {
    afterEach(async () => {
        await User.deleteOne({ email: userEmail });
    });

    it("should reject invalid email", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                name: userName,
                email: "invalid-email",
                password: userPassword,
                passwordConfirmation: userPassword
            });

        expect(res.status).toBe(409);
        expect(res.body.message).toBeDefined();
    });

    it("should reject already used email", async () => {
        await User.create({
            name: userName,
            email: userEmail,
            passwordHash: userPassword
        });

        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                name: userName,
                email: userEmail,
                password: userPassword,
                passwordConfirmation: userPassword
            });

        expect(res.status).toBe(409);
        expect(res.body.message).toMatch(/email/i);
    });

    it("should hash password before saving to database", async () => {
        await request(app)
            .post("/api/auth/signup")
            .send({
                name: userName,
                email: userEmail,
                password: userPassword,
                passwordConfirmation: userPassword
            });

        const user = await User.findOne({ email: userEmail });

        expect(user).toBeTruthy();
        expect(user.passwordHash).toBeDefined();
        expect(user.passwordHash).not.toBe(userPassword);
    });
});


describe("POST /api/auth/login", () => {
    beforeAll(async () => {
        // on créer un seul utilisateur pour tous les tests
        await request(app)
            .post("/api/auth/signup")
            .send({
                name: userName,
                email: userEmail,
                password: userPassword,
                passwordConfirmation: userPassword
            });
    });

    afterAll(async () => {
        await User.deleteOne({ email: userEmail });
    });

    it("password is correctly hashed", async () => {
        const user = await User.findOne({ email: userEmail });

        expect(user).toBeTruthy();
        expect(user.passwordHash).toBeDefined();
        expect(user.passwordHash).not.toBe(userPassword);
    });

    it("should return invalid user or password", async () => {

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                name: userName,
                email: "haha@gmail.com",
            });

        expect(res.status).toBe(400);
    });
});

describe("GET /api/auth/me", () => {
    let cookie;

    beforeAll(async () => {
        // on créer un seul utilisateur pour tous les tests
        await request(app)
            .post("/api/auth/signup")
            .send({
                name: userName,
                email: userEmail,
                password: userPassword,
                passwordConfirmation: userPassword
            });

        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: userEmail,
                password: userPassword
            });
        cookie = loginRes.headers["set-cookie"];
    });

    afterAll(async () => {
        await request(app)
            .put("/api/auth/logout")
            .send({});
        await User.deleteOne({ email: userEmail });
    });

    it("should get user's informations successfully", async () => {
        const res = await request(app)
            .get("/api/auth/me")
            .set("Cookie", cookie);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(userEmail);
        expect(res.body.name).toBe(userName);
        expect(res.body).not.toHaveProperty("password");
        expect(res.body).not.toHaveProperty("passwordHash");
    });
});


describe("PUT /api/auth/me", () => {
    let cookie;

    beforeEach(async () => {
        // on créer un seul utilisateur pour tous les tests
        await request(app)
            .post("/api/auth/signup")
            .send({
                name: userName,
                email: userEmail,
                password: userPassword,
                passwordConfirmation: userPassword
            });

        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: userEmail,
                password: userPassword
            });
        cookie = loginRes.headers["set-cookie"];
    });

    afterEach(async () => {
        await request(app)
            .put("/api/auth/logout")
            .set("Cookie", cookie);
        await User.deleteOne({ email: userEmail });
    })

    it("should update the user profile successfully", async () => {
        const res = await request(app)
            .put(`/api/auth/me`)
            .send({
                name: "lol"
            })
            .set("Cookie", cookie);

        expect(res.status).toBe(200);
        expect(res.body._doc.name).toBe("lol");
        expect(res.body._doc).not.toHaveProperty("passwordHash");
    });
});