import express from 'express';
import Event from '../models/event.model.js'; 
import auth from "../middlewares/auth.js";
import {
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const q = { ...req.query };
    const now = new Date();
    let filter = { status: 'active' };

    // CAS 1 : L'utilisateur a sélectionné une date spécifique (ex: via le calendrier)
    if (q.date) {
      const d = new Date(q.date);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      
      // On affiche TOUT le programme de cette journée (passé ou futur)
      filter.start_date = { $lte: endOfDay };
      filter.end_date = { $gte: startOfDay };
    } 

    if (q.type) {
      filter.type = String(q.type).toLowerCase();
    }

    const events = await Event.find(filter).sort({ start_date: 1 }).lean();
    
    return res.json(events);
  } catch (err) {
    console.error('Erreur lors de la récupération des événements:', err);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

router.post('/', auth, createEvent);
router.get('/:id', auth, getEventById);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

export default { router, prefix: "/api/events" };