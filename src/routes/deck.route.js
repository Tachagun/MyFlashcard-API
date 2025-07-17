
import express from "express";
import { copyDeck, createDeck, getAllPublicDecks, getDeckById, reportDeck, restoreDeck, softDeleteDeck, toggleLikeDeck, updateDeck, uploadDeckCover } from "../controllers/deck.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/uploadImage.js";
import { cleanupOldDecks } from "../utils/deckSoftDeleteCleanup.js";
import { validate } from "../middlewares/validate.js";
import { reportDeckSchema } from "../validators/reportDeckSchema.js";
import { getMyDecks } from "../controllers/user.controller.js";

const deckRoute = express.Router();

// deck cover image upload
deckRoute.post("/cover-upload", verifyToken, upload.single('image'), uploadDeckCover);

deckRoute.post("/", verifyToken, createDeck);
deckRoute.put("/:id", verifyToken, updateDeck);

// all public decks
deckRoute.get("/", getAllPublicDecks);
// my decks
deckRoute.get("/me", verifyToken, getMyDecks);
//view deck detail
deckRoute.get('/:id', getDeckById);



deckRoute.delete('/:id/soft-delete', verifyToken, softDeleteDeck);
deckRoute.put('/:id/restore', verifyToken, restoreDeck);

deckRoute.post('/:id/like', verifyToken, toggleLikeDeck);
deckRoute.post('/:id/report', verifyToken, validate(reportDeckSchema), reportDeck);
deckRoute.post('/:id/copy', verifyToken, copyDeck);




//test cleanup 7days deleted
// deckRoute.post("/test/cleanup", async (req, res, next) => {
//   try {
//     await cleanupOldDecks();
//     res.status(200).json({ message: "Cleanup ran successfully." });
//   } catch (error) {
//     next(error);
//   }
// });

export default deckRoute;
