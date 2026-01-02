import express from "express";

import auth from "../../middlewares/auth.middleware.js";
import { requireRole } from '../../middlewares/admin/requireRole.middleware.js';
import { findStaffAvailability } from "../../services/admin/staffAvailability.service.js";


import { createAvailability, updateAvailability, deleteAvailability } from "../../controllers/admin/staffAvailability.controller.js";

const router = express.Router();

router.post("/", auth, requireRole('staff'), createAvailability);
router.put("/:id", auth, requireRole('staff'), findStaffAvailability, updateAvailability);
router.delete("/:id", auth, requireRole('staff'), findStaffAvailability, deleteAvailability);

export default { router, prefix: "/api/staff/availability" };