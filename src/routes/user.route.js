import { Router } from "express";
import { editMe, getUserPublicDecks, uploadProfilePic } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { updateProfileSchema } from "../validators/updateProfileSchema.js";
import { getMe } from "../controllers/user.controller.js";
import upload from "../middlewares/uploadImage.js";
// Upload profile picture

const userRoute = Router();

userRoute.put("/me", verifyToken, validate(updateProfileSchema), editMe);
userRoute.get("/me", verifyToken, getMe);

userRoute.post("/me/profile-pic", verifyToken, upload.single("image"), uploadProfilePic);

//a user's public deck
userRoute.get('/:userId/decks', getUserPublicDecks);


export default userRoute;
