import { PrismaClient } from '../src/generated/prisma/index.js'; // adjust path as needed
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("123456", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "alice@gmail.com",
        password: hashed,
        username: "alice001",
      },
      {
        email: "bob@gmail.com",
        password: hashed,
        username: "",
      },
      {
        email: "charlie@gmail.com",
        password: hashed,
        username: "charlie03",
      }
    ],
  });

  console.log("Seeded mock users.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
