
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // your Express app
const User = require("../models/userModel");
const Post = require("../models/PostModel");
const jwt = require("jsonwebtoken");

let token;
let postId;


const testUser = {
  username: "posttestuser",
  email: "posttestuser@example.com",
  password: "testpass123",
  passwordConfirm: "testpass123",
};

// Run before all tests
beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/post-test-db");

  const user = await User.create({ ...testUser, isverified: true });
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
});

//  Cleanup after all tests
afterAll(async () => {
  await User.deleteMany();
  await Post.deleteMany();
  await mongoose.connection.close();
});

//  Test POST creation
describe("POST /api/v1/posts/create-post", () => {
  it("should fail without image", async () => {
    const res = await request(app)
      .post("/api/v1/posts/create-post")
      .set("Authorization", `Bearer ${token}`)
      .field("caption", "Test Post");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Image is required/i);
  });
});

// Test GET all posts
describe("GET /api/v1/posts/all", () => {
  it("should return all posts", async () => {
    const res = await request(app).get("/api/v1/posts/all");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
  });
});
