
// src/routes/event.routes.js
import express from 'express';
import { getDB } from '../db.js';

const router = express.Router();
const ALLOWED_TYPES = ['feeding', 'show', 'workshop', 'tour', 'special', 'conservation'];

router.get('/', async (req, res) => {
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
    const endOfDay   = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    filter.$and = [
      { start_date: { $lte: endOfDay } },
      { end_date:   { $gte: startOfDay } }
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

// Import controller functions for other CRUD operations
import {
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller.js';

// POST /api/events - Create new event
router.post('/', createEvent);

// GET /api/events/:id - Get event by ID
router.get('/:id', getEventById);

// PUT /api/events/:id - Update event
router.put('/:id', updateEvent);

// DELETE /api/events/:id - Delete event
router.delete('/:id', deleteEvent);

export default router;
