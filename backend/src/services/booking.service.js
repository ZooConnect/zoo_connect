import { CustomError } from "../middlewares/errorHandler.js";

import * as eventService from "../services/event.service.js";

import bookingRepo from "../repositories/booking.repository.js";

import { parseDate, dateIsPastFrom } from '../utils/date.helper.js';

import MESSAGES from "../constants/messages.js";


const canCancelBooking = (booking) => {
    return !booking.isCancelled() && !booking.isPast();
}

export const reprogramBooking = async (booking, newDate) => {
    const event = booking.event;

    if (!newDate) throw new CustomError(MESSAGES.BOOKING.REPROGRAM_REQUIRES_DATA);
    if (!canCancelBooking(booking)) throw new CustomError(MESSAGES.BOOKING.ALREADY_CANCELLED);
    if (eventService.isEventActive(event)) throw new CustomError(MESSAGES.EVENT.NOT_ACTIVE);
    if (eventService.isEventPast(event)) throw new CustomError(MESSAGES.EVENT.IS_FINISHED);

    const { ok, date } = parseDate(newDate);

    if (!ok) throw new CustomError(MESSAGES.DATE.INVALID_FORMAT);
    if (dateIsPastFrom(date)) throw new CustomError(MESSAGES.DATE.END_BEFORE_START);

    return bookingRepo.updateBooking(booking._id,
        {
            reprogrammedFrom: booking.bookingDate,
            reprogrammedTo: date
        }
    );

}

export const cancelBooking = async (booking, reason = "") => {
    if (!canCancelBooking(booking)) throw new CustomError(MESSAGES.BOOKING.ALREADY_CANCELLED);

    return bookingRepo.updateBooking(booking._id,
        {
            status: 'cancelled',
            cancelledAt: new Date(),
            cancelReason: reason || 'User requested cancellation'
        }
    )
}

export const createBooking = async (booking, metadata = {}) => bookingRepo.createBooking(booking, metadata);

export const findBooking = async (bookingId) => {
    const booking = await bookingRepo.readBookingById(bookingId);
    if (!booking) throw new CustomError(MESSAGES.BOOKING.NOT_FOUND);
    return booking;
}

export const requireBookingOwnerOrAdmin = (booking, user) => {
    if (booking.userId.toString() !== user.id/* && user.role !== 'admin'*/) {
        throw new CustomError(MESSAGES.BOOKING.PERMISSION_DENIED_TO_VIEW);
    }
    return true;
};

export const listUserBookings = async (userId) => {
    return bookingRepo.readBookingsByUserId(userId,
        {
            status: 'active'
        }
    );
}