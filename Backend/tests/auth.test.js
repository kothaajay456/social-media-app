
const request = require("supertest");
const app = require("../app");

describe("Auth tests", () => {
  it("should sign up a user", async () => {
    const res = await request(app).post("/api/v1/users/signup").send({
      username: "testuser",
      email: "test@test.com",
      password: "password123",
      passwordConfirm: "password123",
    });
    expect(res.statusCode).toBe(200);
  });
});

