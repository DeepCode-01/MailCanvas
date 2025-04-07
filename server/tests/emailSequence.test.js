const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const EmailSequence = require("../models/EmailSequence");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: "test-message-id",
    }),
  }),
}));

// Mock Agenda
jest.mock("agenda", () => {
  return function () {
    return {
      define: jest.fn(),
      schedule: jest.fn().mockResolvedValue({}),
      start: jest.fn().mockResolvedValue({}),
      cancel: jest.fn().mockResolvedValue({}),
      now: jest.fn().mockResolvedValue({}),
    };
  };
});

describe("Email Sequence API", () => {
  let mongoServer;
  let token;
  let userId;

  beforeAll(async () => {
    // Create an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword123",
    });
    await user.save();
    userId = user._id;

    // Generate token for the test user
    token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "test-secret",
      {
        expiresIn: "1h",
      }
    );
  });

  afterAll(async () => {
    // Clean up and disconnect from the database
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await EmailSequence.deleteMany({});
  });

  // Test creating a new sequence
  test("Should create a new email sequence", async () => {
    const sequenceData = {
      name: "Test Sequence",
      nodes: [
        {
          id: "node_1",
          type: "leadSource",
          position: { x: 100, y: 100 },
          data: { source: "Website" },
        },
        {
          id: "node_2",
          type: "delay",
          position: { x: 200, y: 200 },
          data: { delay: "2", unit: "day" },
        },
        {
          id: "node_3",
          type: "coldEmail",
          position: { x: 300, y: 300 },
          data: { subject: "Test Email", message: "This is a test email." },
        },
      ],
      edges: [
        { id: "edge_1", source: "node_1", target: "node_2" },
        { id: "edge_2", source: "node_2", target: "node_3" },
      ],
    };

    const response = await request(app)
      .post("/api/sequences")
      .set("Authorization", `Bearer ${token}`)
      .send(sequenceData);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Test Sequence");
    expect(response.body.nodes.length).toBe(3);
    expect(response.body.edges.length).toBe(2);
    expect(response.body.userId.toString()).toBe(userId.toString());
  });

  // Test scheduling a sequence
  test("Should schedule emails based on sequence flow", async () => {
    // Create a test sequence
    const sequence = new EmailSequence({
      name: "Test Sequence",
      nodes: [
        {
          id: "node_1",
          type: "leadSource",
          position: { x: 100, y: 100 },
          data: { source: "Website" },
        },
        {
          id: "node_2",
          type: "delay",
          position: { x: 200, y: 200 },
          data: { delay: "2", unit: "day" },
        },
        {
          id: "node_3",
          type: "coldEmail",
          position: { x: 300, y: 300 },
          data: { subject: "Test Email", message: "This is a test email." },
        },
      ],
      edges: [
        { id: "edge_1", source: "node_1", target: "node_2" },
        { id: "edge_2", source: "node_2", target: "node_3" },
      ],
      userId,
    });
    await sequence.save();

    // Schedule the sequence
    const scheduleData = {
      startTime: new Date().toISOString(),
      recipientEmail: "recipient@example.com",
    };

    const response = await request(app)
      .post(`/api/sequences/${sequence._id}/schedule`)
      .set("Authorization", `Bearer ${token}`)
      .send(scheduleData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sequence scheduled successfully");
  });

  // Test retrieving all sequences for a user
  test("Should get all sequences for the current user", async () => {
    // Create test sequences
    const sequences = [
      {
        name: "Test Sequence 1",
        nodes: [],
        edges: [],
        userId,
      },
      {
        name: "Test Sequence 2",
        nodes: [],
        edges: [],
        userId,
      },
    ];

    await EmailSequence.insertMany(sequences);

    const response = await request(app)
      .get("/api/sequences")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe("Test Sequence 1");
    expect(response.body[1].name).toBe("Test Sequence 2");
  });

  // Test updating a sequence
  test("Should update an existing sequence", async () => {
    // Create a test sequence
    const sequence = new EmailSequence({
      name: "Original Name",
      nodes: [],
      edges: [],
      userId,
    });
    await sequence.save();

    const updateData = {
      name: "Updated Name",
      nodes: [
        {
          id: "node_1",
          type: "coldEmail",
          position: { x: 100, y: 100 },
          data: { subject: "New Subject", message: "New Message" },
        },
      ],
      edges: [],
    };

    const response = await request(app)
      .patch(`/api/sequences/${sequence._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Name");
    expect(response.body.nodes.length).toBe(1);
    expect(response.body.nodes[0].data.subject).toBe("New Subject");
  });

  // Test deleting a sequence
  test("Should delete a sequence", async () => {
    // Create a test sequence
    const sequence = new EmailSequence({
      name: "To Be Deleted",
      nodes: [],
      edges: [],
      userId,
    });
    await sequence.save();

    const response = await request(app)
      .delete(`/api/sequences/${sequence._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sequence deleted");

    // Verify sequence is deleted
    const found = await EmailSequence.findById(sequence._id);
    expect(found).toBeNull();
  });
});
