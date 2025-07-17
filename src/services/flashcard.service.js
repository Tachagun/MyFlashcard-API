import prisma from "../config/prisma.config.js";
import createError from "../utils/createError.js";


export async function getMyFlashcardsService(userId) {
  return prisma.flashcard.findMany({
    where: { userId },
    include: {
      tags: {
        select: { tag: true }  // include tag info
      }
    },
    orderBy: { createdAt: "desc" }  // newest first
  });
}

// Create a new flashcard
export async function createFlashcardService(userId, data) {
  const { question, questionPic, answer, answerPic, detail } = data;

  const flashcard = await prisma.flashcard.create({
    data: {
      question,
      questionPic,
      answer,
      answerPic,
      detail,
      userId,
    },
  });

  return flashcard;
}

// Update a flashcard by id and user ownership
export async function updateFlashcardService(userId, flashcardId, data) {
  const flashcard = await prisma.flashcard.findUnique({
    where: { id: flashcardId },
  });

  if (!flashcard) createError(404, "Flashcard not found");
  if (flashcard.userId !== userId) createError(403, "Unauthorized");

  const updatedFlashcard = await prisma.flashcard.update({
    where: { id: flashcardId },
    data,
  });

  return updatedFlashcard;
}

// Delete flashcard if owned by user
export async function deleteFlashcardService(userId, flashcardId) {
  const flashcard = await prisma.flashcard.findUnique({
    where: { id: flashcardId },
  });

  if (!flashcard) createError(404, "Flashcard not found");
  if (flashcard.userId !== userId) createError(403, "Unauthorized");

  await prisma.flashcard.delete({
    where: { id: flashcardId },
  });

  return true;
}

// Add a flashcard to a deck
export async function addFlashcardToDeckService(deckId, flashcardId) {
  // Check if the relation already exists to avoid duplicates
  const exists = await prisma.deckFlashcard.findUnique({
    where: {
      deckId_flashcardId: {
        deckId,
        flashcardId,
      },
    },
  });

  if (exists) {
    createError(409, "Flashcard is already in the deck");
  }

  return prisma.deckFlashcard.create({
    data: {
      deckId,
      flashcardId,
    },
  });
}

// Remove a flashcard from a deck
export async function removeFlashcardFromDeckService(deckId, flashcardId) {
  const relation = await prisma.deckFlashcard.findUnique({
    where: {
      deckId_flashcardId: {
        deckId,
        flashcardId,
      },
    },
  });

  if (!relation) {
    createError(404, "Flashcard not found in the deck");
  }

  return prisma.deckFlashcard.delete({
    where: {
      deckId_flashcardId: {
        deckId,
        flashcardId,
      },
    },
  });
}

// Get flashcards by deckId (optional: add pagination)
export async function getFlashcardsByDeckService(deckId) {
  return prisma.flashcard.findMany({
    where: {
      decks: {
        some: { deckId },
      },
    },
  });
}


export async function updateTagsForFlashcardService(userId, flashcardId, tagInputs) {
  // 1. Validate flashcard ownership
  const flashcard = await prisma.flashcard.findUnique({
    where: { id: flashcardId },
    include: { tags: true },
  });
  if (!flashcard) createError(404, "Flashcard not found");
  if (flashcard.userId !== userId) createError(403, "Unauthorized");

  // 2. Separate tag ids and tag names
  const tagIds = [];
  const tagNames = [];
  for (const t of tagInputs) {
    if (typeof t === 'number') tagIds.push(t);
    else if (typeof t === 'object' && t !== null && t.id) tagIds.push(t.id);
    else if (typeof t === 'string') tagNames.push(t.trim().toLowerCase());
  }

  // 3. Find existing tags by id and name
  const existingTags = await prisma.tag.findMany({
    where: {
      OR: [
        tagIds.length ? { id: { in: tagIds } } : undefined,
        tagNames.length ? { name: { in: tagNames } } : undefined,
      ].filter(Boolean),
    },
  });
  const existingTagIds = new Set(existingTags.map(tag => tag.id));
  const existingTagNames = new Set(existingTags.map(tag => tag.name));

  // 4. Create tags that don't exist yet (from names only)
  const tagsToCreate = tagNames.filter(name => !existingTagNames.has(name));
  const createdTags = await Promise.all(
    tagsToCreate.map(name => prisma.tag.create({ data: { name } }))
  );

  const allTags = [...existingTags, ...createdTags];

  // 5. Remove all existing tag relations from flashcard
  await prisma.flashcardTag.deleteMany({
    where: { flashcardId },
  });

  // 6. Create new flashcardTag relations
  await Promise.all(
    allTags.map(tag =>
      prisma.flashcardTag.create({
        data: {
          flashcardId,
          tagId: tag.id,
        },
      })
    )
  );

  return allTags;
}
