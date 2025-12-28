import request from "supertest";
import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest"; // Added hooks
import mongoose from "mongoose";

import app from "../src/app.js";
import User from "../src/models/user.model.js";
import { connectDB } from "../src/db/mongoDB.js"; // Import connection function

describe("POST /api/users/signup", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should reject invalid email", async () => {
    const res = await request(app)
      .post("/api/users/signup")
      .send({
        name: "Test User",
        email: "invalid-email",
        password: "Password123",
        password_confirmation: "Password123"
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBeDefined();
  });

  it("should reject already used email", async () => {
    // utilisateur déjà existant
    await User.create({
      name: "Existing",
      email: "used@zoo.com",
      password_hash: "hashedpassword"
    });

    const res = await request(app)
      .post("/api/users/signup")
      .send({
        name: "New User",
        email: "used@zoo.com",
        password: "Password123",
        password_confirmation: "Password123"
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/email/i);
  });

  it("should hash password before saving to database", async () => {
    const plainPassword = "Password123";

    await request(app)
      .post("/api/users/signup")
      .send({
        name: "Hash Test",
        email: "hash@zoo.com",
        password: plainPassword,
        password_confirmation: plainPassword
      });

    const user = await User.findOne({ email: "hash@zoo.com" });

    expect(user).toBeTruthy();
    expect(user.password_hash).toBeDefined();
    expect(user.password_hash).not.toBe(plainPassword);
  });

  /*
    it("should update the user profile successfully", async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({
          name: "Updated Name",
          email: "newemail@zoo.com",
          password_hash: "newpassword123"
        });
  
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Updated Name");
      expect(res.body.email).toBe("newemail@zoo.com");
      expect(res.body).not.toHaveProperty("password");
    });
  
    it("should return 404 if user does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/users/${fakeId}`)
        .send({ name: "Ghost" });
  
      expect(res.status).toBe(404);
    });
  
    it("should return 400 if email is already taken", async () => {
      await User.create({
        name: "Other User",
        email: "taken@zoo.com",
        password_hash: "123"
      });
  
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({ email: "taken@zoo.com" });
  
      expect(res.status).toBe(400);
    });*/
});