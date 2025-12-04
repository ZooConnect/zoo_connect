import request from "supertest";
import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest"; // Added hooks
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import mongoose from "mongoose";
import { connectToDb } from "../src/db/mongo.js"; // Import connection function

describe("PUT /api/users/:id", () => {
  let userId;

  // 1. Connect to DB before running any tests
  beforeAll(async () => {
    await connectToDb();
  });

  // 2. Clean up and close connection after all tests are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 3. Reset database before each individual test
  beforeEach(async () => {
    await User.deleteMany({});
    const user = await User.create({
      name: "Original Name",
      email: "test@zoo.com",
      password: "password123"
    });
    userId = user._id.toString();
  });

  it("should update the user profile successfully", async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        name: "Updated Name",
        email: "newemail@zoo.com",
        password: "newpassword123"
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
      password: "123"
    });

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ email: "taken@zoo.com" });

    expect(res.status).toBe(400);
  });
});