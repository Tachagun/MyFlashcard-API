import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(createError(401, "No token provided"));

  const token = authHeader.split(" ")[1];
  if (!token) return next(createError(401, "Invalid token format"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(createError(401, "Invalid or expired token"));
    console.log(decoded)
    req.user = decoded;
    next();
  });
};
