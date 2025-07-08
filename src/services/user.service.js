import prisma from "../config/prisma.config.js";

export async function updateUserProfile(userId, data) {
  const filteredData = {};
  if (data.username !== undefined) filteredData.username = data.username;
  if (data.profilePic !== undefined) filteredData.profilePic = data.profilePic;
  if (data.aboutMe !== undefined) filteredData.aboutMe = data.aboutMe;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: filteredData,
    select: {
      id: true,
      username: true,
      profilePic: true,
      aboutMe: true,
      updatedAt: true,
    },
  });
  return updatedUser;
}
