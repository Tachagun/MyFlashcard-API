import jwt from "jsonwebtoken";

// Sign a new JWT token
export const signToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

