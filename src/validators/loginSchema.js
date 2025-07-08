import { object, string } from "yup";

export const loginSchema = object({
  email: string().trim().email().required("Email is required"),
  password: string().trim().min(6).required("Password is required"),
}).noUnknown(true, "Unknown field in input");