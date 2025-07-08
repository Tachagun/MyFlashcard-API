import { Router } from "express";
import { editMe } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { updateProfileSchema } from "../validators/updateProfileSchema.js";

const userRoute = Router();

userRoute.put("/me", verifyToken, validate(updateProfileSchema), editMe);

export default userRoute;
