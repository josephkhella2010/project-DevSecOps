/* import { describe, it, expect, vi, beforeEach } from "vitest";
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
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import generateToken from "../../jwt/generateToken.js";

// Mock dependencies before importing the route
vi.mock("../../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
    findById: vi.fn(),
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

import loginRouter from "../../Api/users/loginUser.js";

describe("POST /api/login", () => {
  let app;

  const mockUser = {
    _id: "111111111111111111111111",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "hashed-password",
  };

  const mockProducts = [
    {
      _id: "222222222222222222222222",
      name: "Chemistry",
    },
  ];

  const mockUserWithProducts = {
    _id: mockUser._id,
    username: mockUser.username,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    products: mockProducts,
  };

  const mockToken = "mock-jwt-token";

  let selectPasswordMock;
  let selectUserMock;
  let populateMock;

  beforeEach(() => {
    vi.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api", loginRouter);

    // User.findOne(...).select("+password")
    selectPasswordMock = vi.fn().mockResolvedValue(mockUser);

    User.findOne.mockReturnValue({
      select: selectPasswordMock,
    });

    // User.findById(...).populate("products").select("-password")
    selectUserMock = vi.fn().mockResolvedValue(mockUserWithProducts);

    populateMock = vi.fn().mockReturnValue({
      select: selectUserMock,
    });

    User.findById.mockReturnValue({
      populate: populateMock,
    });

    bcrypt.compare.mockResolvedValue(true);
    generateToken.mockReturnValue(mockToken);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should log in successfully and return user with populated products", async () => {
    const response = await request(app).post("/api/login").send({
      login: "john@example.com",
      password: "correct-password",
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Login successful",
      token: mockToken,
      user: mockUserWithProducts,
    });

    expect(response.body.user).toHaveProperty("_id", mockUser._id);
    expect(response.body.user).toHaveProperty("products", mockProducts);
    expect(response.body.user).not.toHaveProperty("password");

    expect(User.findOne).toHaveBeenCalledWith({
      email: "john@example.com",
    });

    expect(selectPasswordMock).toHaveBeenCalledWith("+password");

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "correct-password",
      mockUser.password,
    );

    expect(generateToken).toHaveBeenCalledWith(mockUser);

    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(populateMock).toHaveBeenCalledWith("products");
    expect(selectUserMock).toHaveBeenCalledWith("-password");
  });

  it("should return 400 when validation fails", async () => {
    const response = await request(app).post("/api/login").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");

    expect(User.findOne).not.toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it("should normalize email to lowercase", async () => {
    const response = await request(app).post("/api/login").send({
      login: "JOHN@EXAMPLE.COM",
      password: "correct-password",
    });

    expect(response.status).toBe(200);

    expect(User.findOne).toHaveBeenCalledWith({
      email: "john@example.com",
    });
  });

  it("should search by username when login is not an email", async () => {
    const response = await request(app).post("/api/login").send({
      login: "johndoe",
      password: "correct-password",
    });

    expect(response.status).toBe(200);

    expect(User.findOne).toHaveBeenCalledWith({
      username: "johndoe",
    });
  });

  it("should return 401 when the user does not exist", async () => {
    selectPasswordMock.mockResolvedValueOnce(null);

    const response = await request(app).post("/api/login").send({
      login: "unknown@example.com",
      password: "correct-password",
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: "Invalid email/username or password",
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
    expect(User.findById).not.toHaveBeenCalled();
  });

  it("should return 401 when the password is incorrect", async () => {
    bcrypt.compare.mockResolvedValueOnce(false);

    const response = await request(app).post("/api/login").send({
      login: "john@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: "Invalid email/username or password",
    });

    expect(generateToken).not.toHaveBeenCalled();
    expect(User.findById).not.toHaveBeenCalled();
  });

  it("should return 404 when the user cannot be fetched after login", async () => {
    selectUserMock.mockResolvedValueOnce(null);

    const response = await request(app).post("/api/login").send({
      login: "john@example.com",
      password: "correct-password",
    });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: "User not found",
    });
  });

  it("should return 500 when the database lookup fails", async () => {
    selectPasswordMock.mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app).post("/api/login").send({
      login: "john@example.com",
      password: "correct-password",
    });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error: "Login failed due to a server error",
    });
  });

  it("should return 500 when password comparison fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    bcrypt.compare.mockRejectedValueOnce(
      new Error("Password comparison failed"),
    );

    const response = await request(app).post("/api/login").send({
      login: "john@example.com",
      password: "correct-password",
    });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error: "Login failed due to a server error",
    });
  });

  it("should return 500 when fetching populated products fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    populateMock.mockImplementationOnce(() => {
      throw new Error("Populate failed");
    });

    const response = await request(app).post("/api/login").send({
      login: "john@example.com",
      password: "correct-password",
    });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error: "Login failed due to a server error",
    });
  });

  it("should return 500 when token generation fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    generateToken.mockImplementationOnce(() => {
      throw new Error("Token generation failed");
    });

    const response = await request(app).post("/api/login").send({
      login: "john@example.com",
      password: "correct-password",
    });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error: "Login failed due to a server error",
    });

    expect(User.findById).not.toHaveBeenCalled();
  });
});
