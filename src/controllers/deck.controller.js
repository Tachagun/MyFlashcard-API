// Deck cover image upload
import cloudinary from '../config/cloudinary.config.js';
import prisma from '../config/prisma.config.js';
import fs from 'fs';
export async function uploadDeckCover(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    // Upload buffer to cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'deck-covers',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return next(error);
        res.status(200).json({ url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    next(err);
  }
}
// src/controllers/deck.controller.js
import { copyDeckService, createDeckService, getAllPublicDecksService, getDeckByIdService, reportDeckService, restoreDeckService, softDeleteDeckService, toggleLikeDeckService, updateDeckService } from "../services/deck.service.js";
import createError from "../utils/createError.js";

export async function createDeck(req, res, next) {
  try {
    const userId = req.user.id;
    const data = req.body;

    const deck = await createDeckService(userId, data);

    res.status(201).json({
      message: "Deck created successfully.",
      deck,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDeck(req, res, next) {
  try {
    const userId = req.user.id;
    const deckId = Number(req.params.id);
    if (isNaN(deckId)) return next(createError(400, "Invalid deck ID"));

    const data = req.body;

    const updated = await updateDeckService(userId, deckId, data);

    res.status(200).json({
      message: "Deck updated successfully.",
      deck: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllPublicDecks(req, res, next) {
  try {
    const decks = await getAllPublicDecksService();
    res.status(200).json({ decks });
  } catch (error) {
    next(error);
  }
}



export async function softDeleteDeck(req, res, next) {
  try {
    const userId = req.user.id;
    const deckId = Number(req.params.id);
    if (isNaN(deckId)) return next(createError(400, "Invalid deck ID"));

    await softDeleteDeckService(userId, deckId)

    res.status(200).json({ message: "Deck soft deleted successfully." });

  } catch(error) {
    next(error)
  }
}

export async function restoreDeck(req, res, next) {
  try {
    const userId = req.user.id;
    const deckId = parseInt(req.params.id);
    if (isNaN(deckId)) return next(createError(400, "Invalid deck ID"));

    await restoreDeckService(userId, deckId);

    res.status(200).json({ message: "Deck restored successfully." });
  } catch (error) {
    next(error);
  }
}

export async function toggleLikeDeck(req, res, next) {
  try {
    const userId = req.user.id;
    const deckId = Number(req.params.id);
    if (isNaN(deckId)) return next(createError(400, "Invalid deck ID"));

    const result = await toggleLikeDeckService(userId, deckId);

    res.status(200).json({
      message: result.liked ? 'Deck liked' : 'Deck unliked',
      liked: result.liked,
    });
  } catch (err) {
    next(err);
  }
}

export async function reportDeck(req, res, next) {
  try {
    const userId = req.user.id;
    const deckId = Number(req.params.id);
    const { reportReason, reportDetail } = req.body;

    if (!reportReason) {
      return res.status(400).json({ error: 'Report reason is required.' });
    }

    await reportDeckService(userId, deckId, reportReason, reportDetail);

    res.status(200).json({ message: 'Deck reported successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function copyDeck(req, res, next) {
  try {
    const userId = req.user.id;
    const deckId = Number(req.params.id);

    const result = await copyDeckService(userId, deckId);

    res.status(200).json({ message: "Deck copied successfully.", deck: result });

  } catch (err) {
    next(err);
  }
}

export async function getDeckById(req, res, next) {
  try {
    const deckId = Number(req.params.id);
    if (isNaN(deckId)) return next(createError(400, "Invalid deck ID"));

    const deck = await getDeckByIdService(deckId);
    if (!deck) return next(createError(404, "Deck not found"));

    // If deck is not public, only admin can view
    if (!deck.isPublic) {
      // req.user may be undefined for guests
      if (!req.user || req.user.role !== "ADMIN") {
        return next(createError(403, "You are not allowed to view this deck"));
      }
    }

    res.status(200).json({ deck });
  } catch (err) {
    next(err);
  }
}
