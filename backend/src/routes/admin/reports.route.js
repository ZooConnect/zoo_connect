import express from "express";

import auth from "../../middlewares/auth.middleware.js";
import { requireRole } from '../../middlewares/admin/requireRole.middleware.js';

import { getReports } from "../../controllers/admin/reports.controller.js";

const router = express.Router();

router.get("/", auth, requireRole('admin'), getReports);

export default { router, prefix: "/api/admin/reports" };
