import express from 'express';

import auth from "../middlewares/auth.js";

import { findBooking } from '../middlewares/booking.middleware.js';

import { listUserBookings, getBookingById, cancelBooking, reprogramBooking } from '../controllers/booking.controller.js';

const router = express.Router();

router.get('/', auth, listUserBookings);
router.get('/:id', auth, findBooking, getBookingById);
router.delete('/:id', auth, findBooking, cancelBooking);
router.put('/:id', auth, findBooking, reprogramBooking);

export default router;
