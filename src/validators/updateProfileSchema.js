import { object, string } from 'yup';

export const updateProfileSchema = object({
  username: string().trim().min(3).max(20),
  profilePic: string().optional(),
  aboutMe: string().max(300, "300 MAX CHARACTER").optional(),
}).noUnknown(true);