import { Router } from "express";
import { getAllTags, createTag } from "../controllers/tag.controller.js";

const tagRoute = Router();

tagRoute.get("/", getAllTags);
tagRoute.post("/", createTag);

export default tagRoute;
