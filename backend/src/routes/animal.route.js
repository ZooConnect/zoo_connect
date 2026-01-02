import express from "express";

import auth from "../middlewares/auth.middleware.js";

import { getAnimals } from "../controllers/animal.controller.js";

const router = express.Router();

router.get("/", auth, getAnimals);

export default { router, prefix: "/api/animals" };