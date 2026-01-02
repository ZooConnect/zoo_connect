import express from "express";

import auth from "../../middlewares/auth.middleware.js";
import { canGetFeedingSchedules, canCreateFeedingSchedule, canUpdateFeedingSchedule } from "../../middlewares/admin/feedingSchedule.middleware.js";


import { getFeedingSchedules, createFeedingSchedule, updateFeedingSchedule } from "../../controllers/admin/feedingSchedule.controller.js";

const router = express.Router();

router.get("/", auth, canGetFeedingSchedules, getFeedingSchedules);
router.post("/", auth, canCreateFeedingSchedule, createFeedingSchedule);
router.put("/:id", auth, canUpdateFeedingSchedule, updateFeedingSchedule);

export default { router, prefix: "/api/feeding-schedules" };