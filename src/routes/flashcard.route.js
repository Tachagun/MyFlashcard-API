
import express from "express";
import { addFlashcardToDeck, createFlashcard, deleteFlashcard, getMyFlashcards, removeFlashcardFromDeck, updateFlashcard, updateTagsForFlashcard, uploadFlashcardImage } from "../controllers/flashcard.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/uploadImage.js";
import { validate } from "../middlewares/validate.js";





const flashcardRoute = express.Router();

// flashcard image upload
flashcardRoute.post("/image-upload", verifyToken, upload.single('image'), uploadFlashcardImage);

flashcardRoute.post("/", verifyToken, createFlashcard);
flashcardRoute.put("/:id", verifyToken, updateFlashcard);
flashcardRoute.delete("/:id", verifyToken, deleteFlashcard);
flashcardRoute.get("/", verifyToken, getMyFlashcards);

flashcardRoute.post("/:id/decks/:deckId", verifyToken, addFlashcardToDeck);
flashcardRoute.delete("/:id/decks/:deckId", verifyToken, removeFlashcardFromDeck);

// flashcardRoute.post(":/id/tags", verifyToken, addTagsToFlashcard);
// flashcardRoute.delete(":/id/tags", verifyToken, removeTagsFromFlashcard);
flashcardRoute.put("/:id/tags", verifyToken, updateTagsForFlashcard);

export default flashcardRoute;