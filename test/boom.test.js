import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("GET /boom", () => {
  it("returns 500 with error payload", async () => {
    const res = await request(app).get("/boom");
    expect(res.status).toBe(500);
    // This checks if your global error handler works
    expect(res.body).toHaveProperty("error"); 
  });
});