import cloudinary from "../config/cloudinary.config.js";
// POST /api/users/me/profile-pic
export async function uploadProfilePic(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "No image file uploaded." });
    const userId = req.user.id;
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream({ folder: "profile_pics" }, async (error, result) => {
      if (error) return next(error);
      // Update user profilePic
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { profilePic: result.secure_url },
        select: {
          id: true,
          username: true,
          profilePic: true,
          aboutMe: true,
          updatedAt: true,
        },
      });
      res.status(200).json({ message: "Profile picture updated.", user: updated });
    });
    // Pipe file buffer to Cloudinary
    if (req.file && req.file.buffer) {
      const stream = uploadResult;
      stream.end(req.file.buffer);
    }
  } catch (error) {
    next(error);
  }
}
import prisma from "../config/prisma.config.js";
import { getUserDecksService, getUserPublicDecksService } from "../services/deck.service.js";
import { updateUserProfile } from "../services/user.service.js";
import createError from "../utils/createError.js";


export async function editMe(req, res, next) {
  try {
    const userId = req.user.id; 
    const { username, profilePic, aboutMe } = req.body;

    const updated = await updateUserProfile(userId, {
      username,
      profilePic,
      aboutMe,
    });

    res.status(200).json({
      message: "Profile updated successfully.",
      user: updated,
    });
  } catch (error) {
    next(error);
  }
}

export const getMe = async (req, res, next) => {
  try {
    // req.user is set by the verifyToken middleware
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        profilePic: true,
        aboutMe: true,
        role: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true,
        ownedDecks: {
          where: { deletedAt: null },
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            isPublic: true,
            createdAt: true,
            updatedAt: true,
            flashcards: true,
          },
        },
      },
    });

    if (!user) return next(createError(404, "User not found"));

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export async function getUserPublicDecks(req, res, next) {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return next(createError(400, "Invalid user ID"));

    const decks = await getUserPublicDecksService(userId);

    res.status(200).json({ decks });
  } catch (err) {
    next(err);
  }
}

export async function getMyDecks(req, res, next) {
  try {
    const userId = req.user.id;

    const decks = await getUserDecksService(userId);

    res.status(200).json({ decks });
  } catch (err) {
    next(err);
  }
}
