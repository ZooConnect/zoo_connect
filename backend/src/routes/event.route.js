import express from 'express';

import auth from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/admin/requireRole.middleware.js";

import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/event.controller.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', auth, requireRole('admin'), createEvent);

router.get('/:id', auth, getEventById);
router.put('/:id', auth, requireRole('admin'), updateEvent);
router.delete('/:id', auth, requireRole('admin'), deleteEvent);

export default { router, prefix: "/api/events" };