import request from "supertest";
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from "vitest"; // Added hooks
import mongoose from "mongoose";

import app from "../../src/app.js";
import { connectDB } from "../../src/db/mongoDB.js";
import User from "../../src/models/user.model.js";

const userName = "test";
const userEmail = "test@gmail.com";
const userPassword = "Password123";

describe("POST /api/users/signup", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteOne({ email: userEmail });
  });

  it("should reject invalid email", async () => {
    const res = await request(app)
      .post("/api/users/signup")
      .send({
        name: userName,
        email: "invalid-email",
        password: userPassword,
        password_confirmation: userPassword
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toBeDefined();
  });

  it("should reject already used email", async () => {
    await User.create({
      name: userName,
      email: userEmail,
      password_hash: userPassword
    });

    const res = await request(app)
      .post("/api/users/signup")
      .send({
        name: userName,
        email: userEmail,
        password: userPassword,
        password_confirmation: userPassword
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/email/i);
  });

  it("should hash password before saving to database", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        name: userName,
        email: userEmail,
        password: userPassword,
        password_confirmation: userPassword
      });

    const user = await User.findOne({ email: userEmail });

    expect(user).toBeTruthy();
    expect(user.password_hash).toBeDefined();
    expect(user.password_hash).not.toBe(userPassword);
  });
});


describe("POST /api/users/login", () => {
  beforeAll(async () => {
    await connectDB();

    // on créer un seul utilisateur pour tous les tests
    await request(app)
      .post("/api/users/signup")
      .send({
        name: userName,
        email: userEmail,
        password: userPassword,
        password_confirmation: userPassword
      });
  });

  afterAll(async () => {
    await User.deleteOne({ email: userEmail });

    await mongoose.connection.close();
  });

  it("password is correctly hashed", async () => {
    const user = await User.findOne({ email: userEmail });

    expect(user).toBeTruthy();
    expect(user.password_hash).toBeDefined();
    expect(user.password_hash).not.toBe(userPassword);
  });

  it("should return invalid user or password", async () => {

    const res = await request(app)
      .post("/api/users/login")
      .send({
        name: userName,
        email: "haha@gmail.com",
      });

    expect(res.status).toBe(400);
  });
});

/*
describe("GET /api/users/me", () => {
  let userId;
  let cookie;

  beforeAll(async () => {
    await connectDB();

    // on créer un seul utilisateur pour tous les tests
    const res = await request(app)
      .post("/api/users/signup")
      .send({
        name: userName,
        email: userEmail,
        password: userPassword,
        password_confirmation: userPassword
      });

    userId = res.body.user.id;

    const loginRes = await request(app)
      .post("/api/users/login")
      .send({
        name: userName,
        email: userEmail
      });
    cookie = loginRes.headers["set-cookie"];
  });

  afterAll(async () => {
    await request(app)
      .put("/api/users/logout")
      .send({});
    await User.deleteOne({ email: userEmail });
    await mongoose.connection.close();
  });
  
    it("should get user's informations successfully", async () => {
      const loginRes = await request(app)
        .post("/api/users/login")
        .send({
          email: "john@test.com",
          password: "Password123"
        });
  
      expect(loginRes.status).toBe(200);
      expect(loginRes.headers["set-cookie"]).toBeDefined();
  
      const cookie = loginRes.headers["set-cookie"];
  
      // 2️⃣ Appel de /me avec le cookie
      const res = await request(app)
        .get("/api/users/me")
        .set("Cookie", cookie);
  
      expect(res.status).toBe(200);
      expect(res.body.email).toBe("john@test.com");
      expect(res.body.name).toBe("John Doe");
      expect(res.body).not.toHaveProperty("password");
      expect(res.body).not.toHaveProperty("password_hash");
    });
    /*const res = await request(app)
      .get(`/api/users/me`)
      .set("Cookie", cookie);
  
    expect(res.status).toBe(200);
  });
});

/*
describe("PUT /api/users/{id}", () => {
  let userId;

  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    // on créer un seul utilisateur pour tous les tests
    const res = await request(app)
      .post("/api/users/signup")
      .send({
        name: userName,
        email: userEmail,
        password: userPassword,
        password_confirmation: userPassword
      });

    userId = res.body.user.id;

    await request(app)
      .post("/api/users/login")
      .send({
        name: userName,
        email: userEmail
      });
  });

  afterEach(async () => {
    await request(app)
      .put("/api/users/logout")
      .send({});
    await User.deleteOne({ email: userEmail });
  })

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /*it("should update the user profile successfully", async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        name: "lol"
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("lol");
    expect(res.body).not.toHaveProperty("password_hash");
  });
});*/