/*import express from 'express';

import { getDB } from '../db/';

import auth from "../middlewares/auth.js";

import {
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller.js';

const router = express.Router();
const ALLOWED_TYPES = ['feeding', 'show', 'workshop', 'tour', 'special', 'conservation'];

router.get('/', auth, async (req, res) => {
  const q = { ...req.query };
  if (q.type) q.type = String(q.type).toLowerCase();

  if (q.type && !ALLOWED_TYPES.includes(q.type)) {
    return res.status(400).json({ error: true, message: 'Invalid event type' });
  }
  if (q.date && !/^\d{4}-\d{2}-\d{2}$/.test(q.date)) {
    return res.status(400).json({ error: true, message: 'Invalid date format, use YYYY-MM-DD' });
  }
  if (q.date) {
    const testDate = new Date(q.date);
    if (isNaN(testDate.getTime())) {
      return res.status(400).json({ error: true, message: 'Invalid date format, use YYYY-MM-DD' });
    }
  }

  const now = new Date();
  const filter = { status: 'active', end_date: { $gte: now } };

  if (q.type) filter.type = q.type;
  if (q.date) {
    const d = new Date(q.date);
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    filter.$and = [
      { start_date: { $lte: endOfDay } },
      { end_date: { $gte: startOfDay } }
    ];
  }

  try {
    const db = await getDB();
    const events = await db.collection('events')
      .find(filter)
      .sort({ start_date: 1 })
      .toArray();

    return res.json(events);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.post('/', auth, createEvent);
router.get('/:id', auth, getEventById);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

export default { router, prefix: "/api/events" };*/
