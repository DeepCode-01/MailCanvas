const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let mongoServer;
let authToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test user and generate token
  const user = await User.create({
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  });

  authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Email Sequence Endpoints", () => {
  describe("POST /api/sequences", () => {
    it("should create a new email sequence", async () => {
      const res = await request(app)
        .post("/api/sequences")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Test Sequence",
          description: "Test Description",
          emails: [
            {
              subject: "Test Email 1",
              body: "Test Body 1",
              delay: 1,
            },
          ],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("name", "Test Sequence");
    });

    it("should not create sequence without authentication", async () => {
      const res = await request(app).post("/api/sequences").send({
        name: "Test Sequence",
        description: "Test Description",
        emails: [],
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/sequences", () => {
    it("should get all sequences for authenticated user", async () => {
      const res = await request(app)
        .get("/api/sequences")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
