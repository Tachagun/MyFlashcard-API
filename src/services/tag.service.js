import prisma from "../config/prisma.config.js";

export async function getAllTagsService() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" }, // alphabetically sorted
  });
}

export async function createTagService(name) {
  return prisma.tag.create({
    data: { name },
  });
}