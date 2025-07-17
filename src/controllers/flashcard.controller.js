// Flashcard image upload
import cloudinary from '../config/cloudinary.config.js';
export async function uploadFlashcardImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    // Upload buffer to cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'flashcard-images',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return next(error);
        res.status(200).json({ url: result.secure_url });
      }
    );
    stream.end(req.file.buffer);
  } catch (err) {
    next(err);
  }
}
import {
  addFlashcardToDeckService,
  createFlashcardService,
  deleteFlashcardService,
  getMyFlashcardsService,
  removeFlashcardFromDeckService,
  updateFlashcardService,
  updateTagsForFlashcardService,
} from "../services/flashcard.service.js";
import createError from "../utils/createError.js";

export async function getMyFlashcards(req, res, next) {
  try {
    const userId = req.user.id;
    const flashcards = await getMyFlashcardsService(userId);

    res.status(200).json({
      message: `Here are your flashcards [USER ID:${userId}]`,
      flashcards,
    });
  } catch (error) {
    next(error);
  }
}


// Create a new flashcard
export async function createFlashcard(req, res, next) {
  try {
    const userId = req.user.id;
    const data = req.body;
    const { tags = [] } = data;

    // Create flashcard
    const flashcard = await createFlashcardService(userId, data);

    // If tags provided, associate them
    let tagObjs = [];
    if (Array.isArray(tags) && tags.length > 0) {
      // Use updateTagsForFlashcardService to create/associate tags
      tagObjs = await updateTagsForFlashcardService(userId, flashcard.id, tags);
    }

    // Return flashcard with tags
    res.status(201).json({
      message: "Flashcard created successfully.",
      flashcard: { ...flashcard, tags: tagObjs },
    });
  } catch (error) {
    next(error);
  }
}

// Update flashcard (must be owner)
export async function updateFlashcard(req, res, next) {
  try {
    const userId = req.user.id;
    const flashcardId = parseInt(req.params.id);
    if (isNaN(flashcardId))
      return next(createError(400, "Invalid flashcard ID"));

    const data = req.body;
    const { tags = [], ...updateData } = data;

    // Update flashcard fields (excluding tags)
    const updated = await updateFlashcardService(userId, flashcardId, updateData);

    // If tags provided, update tag relations
    let tagObjs = [];
    if (Array.isArray(tags)) {
      tagObjs = await updateTagsForFlashcardService(userId, flashcardId, tags);
    }

    res.status(200).json({
      message: "Flashcard updated successfully.",
      flashcard: { ...updated, tags: tagObjs },
    });
  } catch (error) {
    next(error);
  }
}

// Delete flashcard (must be owner)
export async function deleteFlashcard(req, res, next) {
  try {
    const userId = req.user.id;
    const flashcardId = parseInt(req.params.id);
    if (isNaN(flashcardId))
      return next(createError(400, "Invalid flashcard ID"));

    await deleteFlashcardService(userId, flashcardId);

    res.status(200).json({ message: "Flashcard deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function addFlashcardToDeck(req, res, next) {
  try {
    const flashcardId = Number(req.params.id);
    const deckId = Number(req.params.deckId);

    if (isNaN(flashcardId) || isNaN(deckId)) {
      return next(createError(400, "Invalid flashcard or deck ID"));
    }

    const result = await addFlashcardToDeckService(deckId, flashcardId);

    res.status(201).json({
      message: "Flashcard added to deck successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeFlashcardFromDeck(req, res, next) {
  try {
    const flashcardId = Number(req.params.id);
    const deckId = Number(req.params.deckId);

    if (isNaN(flashcardId) || isNaN(deckId)) {
      return next(createError(400, "Invalid flashcard or deck ID"));
    }

    const result = await removeFlashcardFromDeckService(deckId, flashcardId);

    res.status(200).json({
      message: "Flashcard removed from deck successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// export async function addTagsToFlashcard(req, res, next) {
//   try {
//     const userId = req.user.id;
//     const flashcardId = parseInt(req.params.id);


//     if (isNaN(flashcardId)) return next(createError(400, "Invalid flashcard ID"));

//     const { tags } = req.body;
//     if (!tags || !Array.isArray(tags)) return next(createError(400, "Tags must be an array"));


//     const addedTags = await addTagsToFlashcardService(userId, flashcardId, tags);

//     res.status(200).json({ message: "Tags added", addedTags });
//   } catch (error) {
//     next(error);
//   }
// }


// export async function removeTagsFromFlashcard(req, res, next) {
//   try {
//     const userId = req.user.id;
//     const flashcardId = parseInt(req.params.id);
//     if (isNaN(flashcardId)) return next(createError(400, "Invalid flashcard ID"));

//     const { tagNames } = req.body;
//     if (!Array.isArray(tagNames) || tagNames.length === 0) {
//       return next(createError(400, "tagNames must be a non-empty array"));
//     }

//     const removedTags = await removeTagsFromFlashcardService(userId, flashcardId, tagNames);

//     res.status(200).json({
//       message: "Tags removed successfully.",
//       removedTags,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

export async function updateTagsForFlashcard(req, res, next) {
  try {
    const userId = req.user.id;
    const flashcardId = parseInt(req.params.id);
    if (isNaN(flashcardId)) return next(createError(400, "Invalid flashcard ID"));

    const { tags } = req.body;
    if (!Array.isArray(tags) || tags.length === 0) {
      return next(createError(400, "Tags must be a non-empty array"));
    }

    const updatedTags = await updateTagsForFlashcardService(userId, flashcardId, tags);

    res.status(200).json({
      message: "Tags updated successfully",
      tags: updatedTags,
    });
  } catch (error) {
    next(error);
  }
}
