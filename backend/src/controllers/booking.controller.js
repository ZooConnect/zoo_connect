import * as bookingService from "../services/booking.service.js";
import * as eventService from "../services/event.service.js";

import { respond } from "../utils/response.helper.js";
import { parseDate, dateIsPastFrom } from '../utils/date.helper.js';

import MESSAGES from "../constants/messages.js";


export async function listUserBookings(req, res, next) {
  try {
    const userId = req.user._id;
    const bookings = await bookingService.findBookingsByUserId(userId,
      {
        status: 'active'
      }
    );
    return respond(res, MESSAGES.BOOKING.LOAD_ALL_BOOKINGS_FOR_USER_SUCCESS, bookings);
  } catch (err) {
    console.error('Error in listUserBookings:', err);
    return next(err);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const userId = req.user._id;
    const booking = req.booking;

    if (booking.userId.toString() !== userId) return respond(res, MESSAGES.BOOKING.PERMISSION_DENIED_TO_CANCEL);
    if (booking.status === 'cancelled') return respond(res, MESSAGES.BOOKING.ALREADY_CANCELLED);

    const updatedBooking = await bookingService.modifyBooking(booking._id,
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: req.body?.reason || 'User requested cancellation'
      }
    );

    return respond(res, MESSAGES.BOOKING.CANCELLED_SUCCES, updatedBooking);
  } catch (err) {
    console.error('Error in cancelBooking:', err);
    return next(err);
  }
}

export async function reprogramBooking(req, res, next) {
  try {
    const booking = req.booking;
    const event = req.booking.event;
    const userId = req.user._id;
    const newDate = req.body;

    if (!newDate) return respond(res, MESSAGES.BOOKING.REPROGRAM_REQUIRES_DATA);
    if (booking.userId.toString() !== userId) return respond(res, MESSAGES.BOOKING.PERMISSION_DENIED_TO_REPROGRAM);
    if (bookingService.isBookingCancelled(booking)) return respond(res, MESSAGES.BOOKING.ALREADY_CANCELLED);
    if (eventService.isEventActive(event)) return respond(res, MESSAGES.EVENT.NOT_ACTIVE);
    if (eventService.isEventPast(event)) return respond(res, MESSAGES.EVENT.IS_FINISHED);

    const { ok, date } = parseDate(req.body.startDate);

    if (!ok) return respond(res, MESSAGES.DATE.INVALID_FORMAT);
    if (dateIsPastFrom(date)) return respond(res, MESSAGES.DATE.END_BEFORE_START);

    const newBooking = await bookingService.modifyBooking(booking._id,
      {
        reprogrammedFrom: booking.bookingDate,
        reprogrammedTo: date
      }
    );

    return respond(res, MESSAGES.BOOKING.REPROGRAM_SUCCES, newBooking);
  } catch (err) {
    console.error('Error in reprogramBooking:', err);
    return next(err);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const booking = req.booking;
    const userId = req.user._id;

    // Verify ownership
    if (booking.userId.toString() !== userId) return respond(res, MESSAGES.BOOKING.PERMISSION_DENIED_TO_VIEW);

    return respond(res, MESSAGES.BOOKING.FOUND, booking);
  } catch (err) {
    console.error('Error in getBookingById:', err);
    return next(err);
  }
}
