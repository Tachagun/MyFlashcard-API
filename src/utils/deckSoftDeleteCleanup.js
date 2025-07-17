import cron from 'node-cron';
import prisma from '../config/prisma.config.js'; 

cron.schedule('0 2 * * *', async () => {
  console.log('Running cleanup job for old soft-deleted decks...');

  try {
    const result = await prisma.deck.deleteMany({
      where: {
        deletedAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // older than 7 days
        }
      }
    });

    console.log(`Deleted ${result.count} decks permanently.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});

// Test
export async function cleanupOldDecks() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const result = await prisma.deck.deleteMany({
    where: {
      deletedAt: {
        not: null,
        lt: sevenDaysAgo,
      },
    },
  });

  console.log(`✅ Cleanup complete. Deleted ${result.count} old soft-deleted decks.`);
}