import { object, string, number, date, ref } from "yup";


export const registerSchema = object({
  email: string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),

  password: string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: string()
    .trim()
    .oneOf([ref("password")], "Passwords must match")
    .required("Confirm password is required"),

  username: string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .optional(),
}).noUnknown(true, "Unknown field in input");
