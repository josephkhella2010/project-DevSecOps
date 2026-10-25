import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

import User from "../../models/User.js";

vi.mock("../../models/User.js", () => ({
  default: {
    findByIdAndDelete: vi.fn(),
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

import router from "../../Api/users/deleteUser.js";

const app = express();
app.use(express.json());
app.use("/api", router);

const userId = "111111111111111111111111";
const anotherUserId = "222222222222222222222222";

describe("DELETE /api/delete-user/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete the user and return status 200", async () => {
    User.findByIdAndDelete.mockResolvedValue({
      _id: userId,
      username: "johndoe",
    });

    const response = await request(app)
      .delete(`/api/delete-user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User deleted successfully",
    });

    expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
  });

  it("should return 400 when the user ID is invalid", async () => {
    const response = await request(app)
      .delete("/api/delete-user/invalid-id")
      .set("x-user-id", "invalid-id");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");

    expect(User.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it("should return 403 when deleting another user's account", async () => {
    const response = await request(app)
      .delete(`/api/delete-user/${userId}`)
      .set("x-user-id", anotherUserId);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("You can only delete your own account");

    expect(User.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it("should return 404 when the user does not exist", async () => {
    User.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app)
      .delete(`/api/delete-user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should return 500 when the database operation fails", async () => {
    User.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .delete(`/api/delete-user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to delete user");
  });
});
