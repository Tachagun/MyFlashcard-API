import { getAllTagsService, createTagService } from "../services/tag.service.js";

export async function getAllTags(req, res, next) {
  try {
    const tags = await getAllTagsService();
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
}

export async function createTag(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Tag name is required" });
    }
    const tag = await createTagService(name.trim());
    res.status(201).json({ tag });
  } catch (error) {
    if (error.code === 'P2002') {
      // Prisma unique constraint failed
      return res.status(409).json({ error: "Tag already exists" });
    }
    next(error);
  }
}
