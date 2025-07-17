import {
  getAllReportsService,
  hardDeleteDeckService,
  hardDeleteFlashcardService,
  banUserService,
  resolveReportService
} from '../services/admin.service.js';

export const getAllReports = async (req, res, next) => {
  try {
    const reports = await getAllReportsService();
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

export const hardDeleteDeck = async (req, res, next) => {
  try {
    await hardDeleteDeckService(Number(req.params.id));
    res.json({ message: 'Deck permanently deleted' });
  } catch (err) {
    next(err);
  }
};

export const hardDeleteFlashcard = async (req, res, next) => {
  try {
    await hardDeleteFlashcardService(Number(req.params.id));
    res.json({ message: 'Flashcard permanently deleted' });
  } catch (err) {
    next(err);
  }
};

export const banUser = async (req, res, next) => {
  try {
    await banUserService(Number(req.params.id));
    res.json({ message: 'User banned' });
  } catch (err) {
    next(err);
  }
};

export const resolveReport = async (req, res, next) => {
  try {
    await resolveReportService(Number(req.params.id));
    res.json({ message: 'Report resolved' });
  } catch (err) {
    next(err);
  }
};