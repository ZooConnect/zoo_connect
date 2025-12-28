import express from 'express';

import auth from "../middlewares/auth.js";

import {
  listUserBookings,
  getBookingById,
  cancelBooking,
  reprogramBooking
} from '../controllers/booking.controller.js';

const router = express.Router();

router.get('/', auth, listUserBookings);
router.get('/:id', auth, getBookingById);
router.delete('/:id', auth, cancelBooking);
router.put('/:id', auth, reprogramBooking);

export default router;
