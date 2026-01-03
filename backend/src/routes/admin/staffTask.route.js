import express from "express";

import auth from "../../middlewares/auth.middleware.js";
import { requireRole } from '../../middlewares/admin/requireRole.middleware.js';
import { findStaffTask } from "../../middlewares/admin/staffTask.middleware.js";

import { createTask, deleteTask, updateTask } from "../../controllers/admin/staffTask.controller.js";

const router = express.Router();

router.get("/", auth, requireRole('staff'), findStaffTask);
router.post("/", auth, requireRole('staff'), createTask);
router.put("/:id", auth, requireRole('staff'), findStaffTask, updateTask);
router.delete("/:id", auth, requireRole('staff'), findStaffTask, deleteTask);

export default { router, prefix: "/api/staff/tasks" };