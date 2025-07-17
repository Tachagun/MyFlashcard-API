import prisma from "../config/prisma.config.js";
import createError from "../utils/createError.js";

export async function createDeckService(userId, data) {
  const { title, description, coverImage, isPublic, categoryName } = data;

  let categoryId = null;

  if (categoryName) {
    const category = await prisma.deckCategory.upsert({
      where: { name: categoryName.trim() },
      update: {},
      create: { name: categoryName.trim() },
    });
    categoryId = category.id;
  }

  const deck = await prisma.deck.create({
    data: {
      title,
      description,
      coverImage,
      isPublic: isPublic ?? false,
      userId,
      deckCategoryId: categoryId,
 
    },
  });

  return prisma.deck.findUnique({
    where: { id: deck.id },
    include: {
      category: true,
    },
  });

}

export async function updateDeckService(userId, deckId, data) {
  const { title, description, coverImage, isPublic, categoryName } = data;

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
  });

  if (!deck) return createError(404, "Deck not found");
  if (deck.userId !== userId) return createError(403, "Unauthorized");

  let categoryId = deck.deckCategoryId;

  if (categoryName !== undefined) {
    if (categoryName === null || categoryName.trim() === "") {
      categoryId = null;
    } else {
      const category = await prisma.deckCategory.upsert({
        where: { name: categoryName.trim() },
        update: {},
        create: { name: categoryName.trim() },
      });
      categoryId = category.id;
    }
  }

  const updatedDeck = await prisma.deck.update({
    where: { id: deckId },
    data: {
      title,
      description,
      coverImage,
      isPublic,
      deckCategoryId: categoryId,
    },
  });

   return prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      category: true,
    },
  });
}

// Get all public decks
export async function getAllPublicDecksService() {
  return prisma.deck.findMany({
    where: {
      isPublic: true,
      deletedAt: null,
    },
    include: {
      category: true,
      owner: {
        select: {
          id: true,
          username: true,
          profilePic: true,
        },
      },
      flashcards: {
        include: {
          flashcard: {
            include: {
              tags: {
                select: {
                  tag: true
                },
              },
            },
          },
        },
      },
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}




// get all decks of the user
export async function getUserDecksService(userId) {
  return prisma.deck.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    include: {
      category: true,
      likes: true,
      flashcards: {
        include: {
          flashcard: {
            include: {
              tags: {
                select: {
                  tag: true
                },
              },
            },
          },
        },
      },
    },
  });
}

// for detailed deck page view
export async function getDeckByIdService(deckId) {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      category: true,
      owner: {
        select: {
          id: true,
          username: true,
          profilePic: true,
        },
      },
      likes: true,
      flashcards: {
        include: {
          flashcard: {
            include: {
              tags: {
                select: { tag: true },
              },
            },
          },
        },
      },
    },
  });

  return deck;
}


export async function getUserPublicDecksService(userId) {
  return prisma.deck.findMany({
    where: {
      userId,
      isPublic: true,
      deletedAt: null,
    },
    include: {
      category: true,
      likes: true,
      flashcards: {
        include: {
          flashcard: {
            include: {
              tags: {
                select: {
                  tag: true
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}


// Soft-delete a deck
export async function softDeleteDeckService(userId, deckId) {
  const deck = await prisma.deck.findUnique({ where: { id: deckId } });
  if (!deck) createError(404, "Deck not found");
  if (deck.userId !== userId) createError(403, "Unauthorized");

  return prisma.deck.update({
    where: { id: deckId },
    data: { deletedAt: new Date() },
  });
}

export async function restoreDeckService(userId, deckId) {
  const deck = await prisma.deck.findUnique({ where: { id: deckId } });
  if (!deck) createError(404, "Deck not found");
  if (deck.userId !== userId) createError(403, "Unauthorized");

  return prisma.deck.update({
    where: { id: deckId },
    data: { deletedAt: null },
  });
}

export async function toggleLikeDeckService(userId, deckId) {
  const existingLike = await prisma.deckLike.findUnique({
    where: { userId_deckId: { userId, deckId } },
  });

  if (existingLike) {
    // Unlike
    await prisma.deckLike.delete({
      where: { userId_deckId: { userId, deckId } },
    });
    return { liked: false };
  } else {
    // Like
    await prisma.deckLike.create({
      data: { userId, deckId },
    });
    return { liked: true };
  }
}

export async function reportDeckService(
  userId,
  deckId,
  reportReason,
  reportDetail
) {
  const deck = await prisma.deck.findUnique({ where: { id: deckId } });
  if (!deck) {
    createError(404, "Deck not found.");
  }

  return prisma.deckReports.create({
    data: {
      deckId,
      deckOwnerId: deck.userId,
      reporterId: userId,
      reportReason,
      reportDetail,
    },
  });
}

//dupe deck originated from other public decks
export async function copyDeckService(userId, deckId) {
  // Fetch original deck with flashcards and tags
  const originalDeck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      flashcards: {
        include: {
          flashcard: {
            include: {
              tags: {
                include: { tag: true },
              },
            },
          },
        },
      },
      category: true,
    },
  });

  if (!originalDeck) {
    createError(404, "Deck not found.");
  }
  if (!originalDeck.isPublic) {
    createError(403, "Cannot copy a private deck.");
  }

  // Create new deck owned by user, copying properties except id, createdAt, updatedAt
  const newDeck = await prisma.deck.create({
    data: {
      title: originalDeck.title,
      description: originalDeck.description,
      coverImage: originalDeck.coverImage,
      isPublic: false,
      userId: userId,
      deckCategoryId: originalDeck.deckCategoryId,
      copiedFromId: originalDeck.id,
    },
  });

  // For each flashcard, duplicate flashcard + tags and link to new deck
  for (const deckFlashcard of originalDeck.flashcards) {
    const origFlashcard = deckFlashcard.flashcard;

    // Create new flashcard record owned by user (without deckId, since deck-flashcard join used)
    const newFlashcard = await prisma.flashcard.create({
      data: {
        question: origFlashcard.question,
        questionPic: origFlashcard.questionPic,
        answer: origFlashcard.answer,
        answerPic: origFlashcard.answerPic,
        detail: origFlashcard.detail,
        userId: userId,
      },
    });

    // Copy tags by linking existing tags to new flashcard
    if (origFlashcard.tags.length > 0) {
      const flashcardTagData = origFlashcard.tags.map((ft) => ({
        flashcardId: newFlashcard.id,
        tagId: ft.tagId,
      }));
      await prisma.flashcardTag.createMany({
        data: flashcardTagData,
        skipDuplicates: true,
      });
    }

    // Link new flashcard to new deck in DeckFlashcard join table
    await prisma.deckFlashcard.create({
      data: {
        deckId: newDeck.id,
        flashcardId: newFlashcard.id,
      },
    });
  }

  return newDeck;
}
