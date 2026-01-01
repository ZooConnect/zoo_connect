import express from 'express';

import auth from "../middlewares/auth.middleware.js";

import { findBooking, canCancelBooking, canManageBooking, canViewBooking } from '../middlewares/booking.middleware.js';

import { listUserBookings, getBookingById, cancelBooking, reprogramBooking } from '../controllers/booking.controller.js';

const router = express.Router();

router.get('/', auth, listUserBookings);
router.get('/:id', auth, findBooking, canViewBooking, getBookingById);
router.delete('/:id', auth, findBooking, canCancelBooking, cancelBooking);
router.put('/:id', auth, findBooking, canManageBooking, reprogramBooking);

export default router;
