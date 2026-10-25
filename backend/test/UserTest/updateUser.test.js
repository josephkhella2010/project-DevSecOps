import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

import User from "../../models/User.js";
import bcrypt from "bcrypt";

vi.mock("../../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
  },
}));

vi.mock("../../jwt/authenticateToken.js", () => ({
  default: (req, res, next) => {
    req.user = {
      id: req.headers["x-user-id"],
    };
    next();
  },
}));

import router from "../../Api/users/updateUser.js";

const app = express();
app.use(express.json());
app.use("/api", router);

const userId = "111111111111111111111111";
const anotherUserId = "222222222222222222222222";

const updatedUser = {
  _id: userId,
  username: "johndoe",
  firstName: "John",
  lastName: "Smith",
  email: "john@example.com",
};

function mockUpdateResult(user) {
  User.findByIdAndUpdate.mockReturnValue({
    select: vi.fn().mockResolvedValue(user),
  });
}

describe("PUT /api/update-user/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    User.findOne.mockResolvedValue(null);

    mockUpdateResult(updatedUser);

    bcrypt.hash.mockResolvedValue("hashed-password");
  });

  it("should update a user successfully", async () => {
    const updates = {
      firstName: "John",
      lastName: "Smith",
    };

    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", userId)
      .send(updates);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");

    expect(response.body.user).toEqual({
      id: userId,
      username: "johndoe",
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
    });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
    );

    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should return 400 for an invalid user ID", async () => {
    const response = await request(app)
      .put("/api/update-user/invalid-id")
      .set("x-user-id", "invalid-id")
      .send({ firstName: "John" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid user ID");
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should return 403 when updating another user's account", async () => {
    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", anotherUserId)
      .send({ firstName: "John" });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("You can only update your own account");

    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should return 400 when the update body is empty", async () => {
    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", userId)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should return 400 when an unknown field is provided", async () => {
    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", userId)
      .send({ role: "admin" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should return 409 when a username or email already exists", async () => {
    User.findOne.mockResolvedValue({
      _id: anotherUserId,
      username: "existinguser",
    });

    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", userId)
      .send({ username: "existinguser" });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Username or email already exists");

    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should normalize an email to lowercase", async () => {
    mockUpdateResult({
      ...updatedUser,
      email: "john@example.com",
    });

    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", userId)
      .send({ email: "JOHN@EXAMPLE.COM" });

    expect(response.status).toBe(200);

    expect(User.findOne).toHaveBeenCalledWith({
      _id: { $ne: userId },
      $or: [{ email: "john@example.com" }],
    });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      { $set: { email: "john@example.com" } },
      { new: true, runValidators: true },
    );
  });

  it("should hash the password before updating", async () => {
    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", userId)
      .send({ password: "newPassword123" });

    expect(response.status).toBe(200);
    expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 12);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      { $set: { password: "hashed-password" } },
      { new: true, runValidators: true },
    );
  });

  it("should return 404 when the user does not exist", async () => {
    mockUpdateResult(null);

    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", userId)
      .send({ firstName: "John" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should return 409 for a MongoDB duplicate-key error", async () => {
    const duplicateError = new Error("Duplicate key");
    duplicateError.code = 11000;

    User.findByIdAndUpdate.mockReturnValue({
      select: vi.fn().mockRejectedValue(duplicateError),
    });

    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", userId)
      .send({ firstName: "John" });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Username or email already exists");
  });

  it("should return 500 when a database operation fails", async () => {
    User.findByIdAndUpdate.mockReturnValue({
      select: vi.fn().mockRejectedValue(new Error("Database error")),
    });

    const response = await request(app)
      .put(`/api/update-user/${userId}`)
      .set("x-user-id", userId)
      .send({ firstName: "John" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to update user");
  });
});
