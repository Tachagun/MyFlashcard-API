import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import {
  getAllReports,
  hardDeleteDeck,
  hardDeleteFlashcard,
  banUser,
  resolveReport,
} from "../controllers/admin.controller.js";

const adminRoute = Router();

// All admin routes require authentication and admin privileges
adminRoute.use(verifyToken, verifyAdmin);

adminRoute.get("/reports", getAllReports);
adminRoute.post("/decks/:id/delete", hardDeleteDeck);
adminRoute.post("/flashcards/:id/delete", hardDeleteFlashcard);
adminRoute.post("/users/:id/ban", banUser);
adminRoute.put("/reports/:id/resolve", resolveReport);


export default adminRoute;