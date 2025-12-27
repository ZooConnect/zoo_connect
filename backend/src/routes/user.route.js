import express from "express";

import auth from "../middlewares/auth.js";

import { signup, login } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
//router.put("/:id", auth, updateUser);
//router.get("/:id/membership", auth, getMembership);

export default { router, prefix: "/api/users" };