import express from "express";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validators/registerSchema.js";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { loginSchema } from "../validators/loginSchema.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRoute = express.Router();

// const users = [
//   { id: 1, name: "dum1", password: "1234" },
//   { id: 2, name: "dum2", password: "1234" },
//   { id: 3, name: "dum3", password: "1234" },
//   { id: 4, name: "dum4", password: "1234" },
// ];

authRoute.get("/", (req, res) => {
  res.json({ users });
});

authRoute.post("/register", validate(registerSchema), register)
authRoute.post("/login", validate(loginSchema), login)
authRoute.get("/me", verifyToken, getMe);




export default authRoute;
