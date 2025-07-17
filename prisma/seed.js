
import { PrismaClient } from '../src/generated/prisma/index.js'; // adjust path as needed
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create static mock users
  const users = [
    {
      email: 'bob1@gmail.com',
      password: await bcrypt.hash('123456', 10),
      username: 'bob1',
      profilePic: null,
      aboutMe: 'I am Bob1.',
    },
    {
      email: 'alice@gmail.com',
      password: await bcrypt.hash('123456', 10),
      username: 'alice',
      profilePic: null,
      aboutMe: 'I am Alice.',
    },
    {
      email: 'charlie@gmail.com',
      password: await bcrypt.hash('123456', 10),
      username: 'charlie',
      profilePic: null,
      aboutMe: 'I am Charlie.',
    },
  ];
  await prisma.user.createMany({ data: users });

  // Fetch created users
  const allUsers = await prisma.user.findMany();

  // Create deck categories
  const deckCategories = [
    { name: 'Mathematics' },
    { name: 'Science' },
    { name: 'History' },
    { name: 'Language' },
    { name: 'Programming' },
  ];
  for (const category of deckCategories) {
    await prisma.deckCategory.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }
  const allCategories = await prisma.deckCategory.findMany();

  // Create simple mock decks for each user, assign categories
  for (const [i, user] of allUsers.entries()) {
    await prisma.deck.create({
      data: {
        title: `${user.username}'s Math Deck`,
        description: 'A deck about math.',
        userId: user.id,
        coverImage: null,
        isPublic: true,
        deckCategoryId: allCategories.find(c => c.name === 'Mathematics')?.id,
      },
    });
    await prisma.deck.create({
      data: {
        title: `${user.username}'s Science Deck`,
        description: 'A deck about science.',
        userId: user.id,
        coverImage: null,
        isPublic: false,
        deckCategoryId: allCategories.find(c => c.name === 'Science')?.id,
      },
    });
  }

  // Create mock tags
  const tagNames = ['math', 'science', 'history', 'language', 'coding'];
  for (const name of tagNames) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Create mock flashcards for each user
  for (const [i, user] of allUsers.entries()) {
    await prisma.flashcard.create({
      data: {
        question: `What is 2 + 2?`,
        answer: '4',
        detail: 'Simple math addition.',
        userId: user.id,
      },
    });
    await prisma.flashcard.create({
      data: {
        question: `What is the capital of France?`,
        answer: 'Paris',
        detail: 'Geography question.',
        userId: user.id,
      },
    });
    await prisma.flashcard.create({
      data: {
        question: `What is H2O?`,
        answer: 'Water',
        detail: 'Science question.',
        userId: user.id,
      },
    });
  }

  console.log('Seeded static users, decks, tags, and flashcards. No likes or reports.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
export default main;