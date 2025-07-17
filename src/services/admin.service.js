import prisma from '../config/prisma.config.js';
import createError from '../utils/createError.js';

export const getAllReportsService = async () => {
  return prisma.deckReports.findMany({
    include: { deck: true, reporter: true, deckOwner: true },
    orderBy: { reportedAt: 'desc' }
  });
};

export const hardDeleteDeckService = async (deckId) => {
  await prisma.deck.delete({ where: { id: deckId } });
};

export const hardDeleteFlashcardService = async (flashcardId) => {
  await prisma.flashcard.delete({ where: { id: flashcardId } });
};

export const banUserService = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { accountStatus: 'SUSPENDED' }
  });
};

export const resolveReportService = async (reportId) => {
  await prisma.deckReports.update({
    where: { id: reportId },
    data: { reportStatus: 'RESOLVED' }
  });
};