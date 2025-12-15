// src/routes/booking.routes.js
import express from 'express';
import {
  listUserBookings,
  getBookingById,
  cancelBooking,
  reprogramBooking
} from '../controllers/booking.controller.js';

const router = express.Router();

// GET /api/bookings - List user's active bookings
router.get('/', listUserBookings);

// GET /api/bookings/:id - Get booking details
router.get('/:id', getBookingById);

// DELETE /api/bookings/:id - Cancel booking
router.delete('/:id', cancelBooking);

// PUT /api/bookings/:id - Reprogram booking
router.put('/:id', reprogramBooking);

export default router;
