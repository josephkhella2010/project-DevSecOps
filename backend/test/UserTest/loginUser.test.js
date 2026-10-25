import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

import User from "../../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../../jwt/generateToken.js";
import loginSchema from "../../validators/loginValidator.js";
import router from "../../Api/users/loginUser.js";

vi.mock("../../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("../../jwt/generateToken.js", () => ({
  default: vi.fn(),
}));

vi.mock("../../validators/loginValidator.js", () => ({
  default: {
    safeParse: vi.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/api", router);

const validCredentials = {
  login: "johndoe",
  password: "StrongPassword123!",
};

const mockUser = {
  _id: "111111111111111111111111",
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "hashed-password",
};

describe("POST /api/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    loginSchema.safeParse.mockReturnValue({
      success: true,
      data: validCredentials,
    });

    User.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser),
    });

    bcrypt.compare.mockResolvedValue(true);
    generateToken.mockReturnValue("mock-jwt-token");
  });

  it("should log in successfully and return status 200", async () => {
    const response = await request(app)
      .post("/api/login")
      .send(validCredentials);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toBe("mock-jwt-token");

    expect(response.body.user).toEqual({
      id: mockUser._id,
      username: mockUser.username,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
    });

    expect(response.body.user).not.toHaveProperty("password");
    expect(User.findOne).toHaveBeenCalledWith({
      username: "johndoe",
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      validCredentials.password,
      mockUser.password,
    );
    expect(generateToken).toHaveBeenCalledWith(mockUser);
  });

  it("should return 400 when validation fails", async () => {
    loginSchema.safeParse.mockReturnValue({
      success: false,
      error: {
        issues: [
          {
            path: ["password"],
            message: "Password is required",
          },
        ],
      },
    });

    const response = await request(app)
      .post("/api/login")
      .send({ login: "johndoe" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
    expect(response.body.details).toEqual([
      {
        field: "password",
        message: "Password is required",
      },
    ]);

    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("should find a user by email and normalize the email to lowercase", async () => {
    loginSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        login: " JOHN@EXAMPLE.COM ",
        password: "StrongPassword123!",
      },
    });

    const response = await request(app).post("/api/login").send({
      login: " JOHN@EXAMPLE.COM ",
      password: "StrongPassword123!",
    });

    expect(response.status).toBe(200);
    expect(User.findOne).toHaveBeenCalledWith({
      email: "john@example.com",
    });
  });

  it("should return 401 when the user does not exist", async () => {
    User.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .post("/api/login")
      .send(validCredentials);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid email/username or password");

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });

  it("should return 401 when the password is incorrect", async () => {
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/login")
      .send(validCredentials);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid email/username or password");

    expect(generateToken).not.toHaveBeenCalled();
  });

  it("should return 500 when a server error occurs", async () => {
    User.findOne.mockReturnValue({
      select: vi.fn().mockRejectedValue(new Error("Database error")),
    });

    const response = await request(app)
      .post("/api/login")
      .send(validCredentials);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Login failed due to a server error");
  });
});
