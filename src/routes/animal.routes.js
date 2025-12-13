import express from "express";
import { getAnimals } from "../controllers/animal.controller.js";

const router = express.Router();

// GET /api/animals
// This connects the URL to the Controller function we just wrote
router.get("/", getAnimals);

export default router;