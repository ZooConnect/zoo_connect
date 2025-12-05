import express from "express";
// 1. ADD 'getMembership' to the import list
import { updateUser, getMembership } from "../controllers/user.controller.js";

const router = express.Router();

// Jira: "Endpoint PUT /api/users/:id"
router.put("/:id", updateUser);

// 2. ADD THIS NEW ROUTE for Membership
router.get("/:id/membership", getMembership);

export default router;