import prisma from "../config/prisma.config.js";
import { hashPassword } from "../utils/hash.js";

export async function createUser({email, password, username}) {
  const hashedPassword = await hashPassword(password)
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username
    },
    select : {
      id: true,
      email: true,
      username: true,
      createdAt: true
    }
  })
  return newUser
}

export async function findUserByEmail(email) {
  const foundEmail =  await prisma.user.findUnique({
    where: {email}
  })
  return foundEmail
} 