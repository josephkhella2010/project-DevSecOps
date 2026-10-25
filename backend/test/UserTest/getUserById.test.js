/* import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

import User from "../../models/User.js";
import router from "../../Api/users/getUserById.js";

vi.mock("../../models/User.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

// Mock authentication so tests do not need a real JWT.
vi.mock("../../jwt/authenticateToken.js", () => ({
  default: (req, res, next) => {
    req.user = {
      id: req.headers["x-user-id"],
    };
    next();
  },
}));

const app = express();

app.use(express.json());
app.use("/api", router);

const userId = "111111111111111111111111";
const anotherUserId = "222222222222222222222222";

describe("GET /api/user/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the user with status 200", async () => {
    const mockUser = {
      _id: userId,
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@example.com",
    };

    User.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser),
    });

    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith(userId);
  });

  it("should return 400 for an invalid user ID", async () => {
    const response = await request(app)
      .get("/api/user/invalid-id")
      .set("x-user-id", "invalid-id");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
    expect(User.findById).not.toHaveBeenCalled();
  });

  it("should return 403 when accessing another user's account", async () => {
    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", anotherUserId);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("You can only view your own account");
    expect(User.findById).not.toHaveBeenCalled();
  });

  it("should return 404 when the user does not exist", async () => {
    User.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should return 500 when the database query fails", async () => {
    User.findById.mockReturnValue({
      select: vi.fn().mockRejectedValue(new Error("Database error")),
    });

    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error while getting user");
  });

  it("should exclude the password from the database query", async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      _id: userId,
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@example.com",
    });

    User.findById.mockReturnValue({
      select: mockSelect,
    });

    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(200);
    expect(mockSelect).toHaveBeenCalledWith("-password");
    expect(response.body.user).not.toHaveProperty("password");
  });
});
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

import User from "../../models/User.js";
import router from "../../Api/users/getUserById.js";

vi.mock("../../models/User.js", () => ({
  default: {
    findById: vi.fn(),
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

const app = express();

app.use(express.json());
app.use("/api", router);

const userId = "111111111111111111111111";
const anotherUserId = "222222222222222222222222";

describe("GET /api/user/:id", () => {
  let mockSelect;
  let mockPopulate;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSelect = vi.fn();
    mockPopulate = vi.fn();

    mockSelect.mockReturnValue({
      populate: mockPopulate,
    });

    User.findById.mockReturnValue({
      select: mockSelect,
    });
  });

  it("should return the user with status 200", async () => {
    const mockUser = {
      _id: userId,
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@example.com",
    };

    mockPopulate.mockResolvedValue(mockUser);

    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(mockSelect).toHaveBeenCalledWith("-password");
  });

  it("should return 400 for an invalid user ID", async () => {
    const response = await request(app)
      .get("/api/user/invalid-id")
      .set("x-user-id", "invalid-id");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
    expect(User.findById).not.toHaveBeenCalled();
  });

  it("should return 403 when accessing another user's account", async () => {
    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", anotherUserId);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("You can only view your own account");
    expect(User.findById).not.toHaveBeenCalled();
  });

  it("should return 404 when the user does not exist", async () => {
    mockPopulate.mockResolvedValue(null);

    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should return 500 when the database query fails", async () => {
    mockPopulate.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error while getting user");
  });

  it("should exclude the password from the database query", async () => {
    const mockUser = {
      _id: userId,
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@example.com",
    };

    mockPopulate.mockResolvedValue(mockUser);

    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("x-user-id", userId);

    expect(response.status).toBe(200);
    expect(mockSelect).toHaveBeenCalledWith("-password");
    expect(response.body.user).not.toHaveProperty("password");
  });
});
