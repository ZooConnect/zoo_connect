import express from "express";

import auth from "../middlewares/auth.js";

import { signup, login, getMe, logout } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/me", auth, getMe)
router.post("/logout", auth, logout);
//router.put("/:id", auth, updateUser);
//router.get("/:id/membership", auth, getMembership);

export default { router, prefix: "/api/users" };