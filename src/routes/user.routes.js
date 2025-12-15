import express from "express";
import { updateUser } from "../controllers/user.controller.js";

const router = express.Router();

// Jira: "Endpoint PUT /api/users/:id"
router.put("/:id", updateUser);

export default router;