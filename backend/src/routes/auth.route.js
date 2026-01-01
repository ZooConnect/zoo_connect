import express from "express";

import auth from "../middlewares/auth.middleware.js";

import { signup, login, getUser, logout, updateUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/me", auth, getUser);
router.put("/me", auth, updateUser);
router.post("/logout", auth, logout);

export default { router, prefix: "/api/auth" };