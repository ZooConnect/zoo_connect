import express from "express";

import auth from "../../middlewares/auth.middleware.js";
import { requireRole } from '../../middlewares/admin/requireRole.middleware.js';


import { getFeedingSchedules, createFeedingSchedule, updateFeedingSchedule } from "../../controllers/admin/feedingSchedule.controller.js";

const router = express.Router();

router.get("/", auth, requireRole('staff'), getFeedingSchedules);
router.post("/", auth, requireRole('staff'), createFeedingSchedule);
router.put("/:id", auth, requireRole('staff'), updateFeedingSchedule);

export default { router, prefix: "/api/staff/feeding-schedules" };