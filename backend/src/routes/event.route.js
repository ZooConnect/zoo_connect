import express from 'express';

import auth from "../middlewares/auth.js";

import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/event.controller.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', auth, createEvent);

router.get('/:id', auth, getEventById);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

export default { router, prefix: "/api/events" };