import express from "express";

import auth from "../middlewares/auth.js";

import userCtrl from "../controllers/user.controller.js";

const router = express.Router();

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put("/:id", auth, userCtrl.updateUser);
router.get("/:id/membership", auth, userCtrl.getMembership);

export default { router, prefix: "/api/users" };