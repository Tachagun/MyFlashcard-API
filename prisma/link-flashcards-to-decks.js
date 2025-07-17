import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const decks = await prisma.deck.findMany();
  const flashcards = await prisma.flashcard.findMany();

  // For each deck, assign 3 random flashcards (if available)
  for (const deck of decks) {
    // Pick 3 random flashcards
    const shuffled = flashcards.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    for (const card of selected) {
      // Create DeckFlashcard entry if not exists
      await prisma.deckFlashcard.upsert({
        where: { deckId_flashcardId: { deckId: deck.id, flashcardId: card.id } },
        update: {},
        create: { deckId: deck.id, flashcardId: card.id },
      });
    }
  }
  console.log('Linked several cards to each deck.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
