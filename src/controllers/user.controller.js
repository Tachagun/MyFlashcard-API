import { updateUserProfile } from "../services/user.service.js";


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
