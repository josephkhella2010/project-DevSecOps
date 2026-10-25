import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { createUserSchema } from "../../validators/userValidator.js";
import router from "../../Api/users/registerUser.js";

vi.mock("../../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
  },
}));

vi.mock("../../validators/userValidator.js", () => ({
  createUserSchema: {
    safeParse: vi.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/api", router);

const validUser = {
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "StrongPassword123!",
};

describe("POST /api/register-user", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    createUserSchema.safeParse.mockReturnValue({
      success: true,
      data: validUser,
    });

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");

    User.create.mockResolvedValue({
      _id: "111111111111111111111111",
      ...validUser,
      password: "hashed-password",
    });
  });

  it("should register a user and return status 201", async () => {
    const response = await request(app)
      .post("/api/register-user")
      .send(validUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");

    expect(response.body.user).toEqual({
      id: "111111111111111111111111",
      username: validUser.username,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: validUser.email,
    });

    expect(User.findOne).toHaveBeenCalledWith({
      $or: [{ username: validUser.username }, { email: validUser.email }],
    });

    expect(bcrypt.hash).toHaveBeenCalledWith(validUser.password, 12);

    expect(User.create).toHaveBeenCalledWith({
      ...validUser,
      password: "hashed-password",
    });

    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should return 400 when validation fails", async () => {
    createUserSchema.safeParse.mockReturnValue({
      success: false,
      error: {
        issues: [
          {
            path: ["email"],
            message: "Invalid email",
          },
        ],
      },
    });

    const response = await request(app)
      .post("/api/register-user")
      .send({ ...validUser, email: "invalid-email" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
    expect(response.body.details).toEqual([
      {
        field: "email",
        message: "Invalid email",
      },
    ]);

    expect(User.findOne).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });

  it("should return 409 when the username or email already exists", async () => {
    User.findOne.mockResolvedValue({
      _id: "222222222222222222222222",
      username: validUser.username,
    });

    const response = await request(app)
      .post("/api/register-user")
      .send(validUser);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Username or email already exists");

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });

  it("should return 500 when checking for an existing user fails", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/register-user")
      .send(validUser);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to create user");
    expect(User.create).not.toHaveBeenCalled();
  });

  it("should return 500 when saving the user fails", async () => {
    User.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/register-user")
      .send(validUser);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to create user");
  });
});
