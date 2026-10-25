import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

import User from "../../models/User.js";
import router from "../../Api/users/getAllUsers.js";

vi.mock("../../models/User.js", () => ({
  default: {
    find: vi.fn(),
  },
}));

const app = express();

app.use(express.json());
app.use("/api", router);

describe("GET /api/users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all users with status 200", async () => {
    const mockUsers = [
      {
        _id: "111111111111111111111111",
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
      },
      {
        _id: "222222222222222222222222",
        firstName: "Jane",
        lastName: "Smith",
        username: "janesmith",
        email: "jane@example.com",
      },
    ];

    User.find.mockResolvedValue(mockUsers);

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual(mockUsers);
    expect(response.body.users).toHaveLength(2);
    expect(User.find).toHaveBeenCalledOnce();
  });

  it("should return an empty array when no users exist", async () => {
    User.find.mockResolvedValue([]);

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual([]);
  });

  it("should return status 500 when the database query fails", async () => {
    User.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "error while get All Users",
    });
  });
});
