import * as bookingService from "../services/booking.service.js";

import { respond } from "../utils/response.helper.js";

import MESSAGES from "../constants/messages.js";

export async function listUserBookings(req, res, next) {
  try {
    const userId = req.user._id;

    const bookings = await bookingService.listUserBookings(userId);
    return respond(res, MESSAGES.BOOKING.LOAD_ALL_BOOKINGS_FOR_USER_SUCCESS, bookings);
  } catch (err) {
    next(err);
  }
}

export async function createBooking(req, res, next) {
  try {
    const bookingData = {
      userId: req.user._id,
      eventId: req.body?.eventId || (req.event && req.event._id),
      quantity: req.body.quantity || 1,
      bookingDate: req.body.date || req.body.bookingDate
    };

    const booking = await bookingService.createBooking(bookingData);
    return respond(res, MESSAGES.BOOKING.CREATED_SUCCESS, booking);
  } catch (err) {
    next(err);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const booking = req.booking;
    const reason = req.body?.reason;

    const updatedBooking = await bookingService.cancelBooking(booking, reason);
    return respond(res, MESSAGES.BOOKING.CANCELLED_SUCCES, updatedBooking);
  } catch (err) {
    next(err);
  }
}

export async function reprogramBooking(req, res, next) {
  try {
    const booking = req.booking;
    const date = req.body.newDate || req.body.date;

    const newBooking = await bookingService.reprogramBooking(booking, date);
    return respond(res, MESSAGES.BOOKING.REPROGRAM_SUCCES, newBooking);
  } catch (err) {
    next(err);
  }
}

export async function getBooking(req, res, next) {
  try {
    const booking = req.booking;
    return respond(res, MESSAGES.BOOKING.FOUND, booking);
  } catch (err) {
    next(err);
  }
}
