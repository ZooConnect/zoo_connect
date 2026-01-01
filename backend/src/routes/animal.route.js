import express from "express";

import auth from "../middlewares/auth.js";

import { getAnimals } from "../controllers/animal.controller.js";

const router = express.Router();

router.get("/", getAnimals);

export default { router, prefix: "/api/animals" };