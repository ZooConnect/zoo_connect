import express from "express";

import auth from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/admin/requireRole.middleware.js";

import { getAnimals, createAnimal, updateAnimal, deleteAnimal } from "../controllers/animal.controller.js";

const router = express.Router();

// Public: allow anyone to list animals (Explore page)
router.get("/", getAnimals);
router.post("/", auth, requireRole('admin'), createAnimal);
router.put("/:id", auth, requireRole('admin'), updateAnimal);
router.delete("/:id", auth, requireRole('admin'), deleteAnimal);

export default { router, prefix: "/api/animals" };