/* import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      error: "Server authentication is not configured",
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Access token is missing or invalid",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      error: "Access token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = {
      id: decoded.sub,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error:
        error.name === "TokenExpiredError"
          ? "Token has expired. Please log in again."
          : "Invalid access token",
    });
  }
};

export default authenticateToken;
 */

import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      error: "Server authentication is not configured",
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Access token is missing or invalid",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      error: "Access token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded.sub !== "string" ||
      decoded.sub.length === 0 ||
      typeof decoded.username !== "string"
    ) {
      return res.status(401).json({
        error: "Invalid access token",
      });
    }

    req.user = {
      id: decoded.sub,
      username: decoded.username,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      error:
        error.name === "TokenExpiredError"
          ? "Token has expired. Please log in again."
          : "Invalid access token",
    });
  }
};

export default authenticateToken;
