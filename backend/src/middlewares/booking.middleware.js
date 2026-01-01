import * as bookingService from "../services/booking.service.js";

import MESSAGES from "../constants/messages.js";

import { CustomError } from "./errorHandler.js";

export const findBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const booking = await bookingService.findBookingById(bookingId);
        if (!booking) return next(new CustomError(MESSAGES.BOOKING.NOT_FOUND));

        req.booking = booking;
        next();
    } catch (error) {
        return next(new CustomError({ status: 401, message: error.message }));
    }
};

export const requireBookingOwnerOrAdmin = (req, res, next) => {
    const booking = req.booking;
    const user = req.user;

    if (booking.userId.toString() !== user.id/* && user.role !== 'admin'*/) {
        return next(new CustomError(MESSAGES.BOOKING.PERMISSION_DENIED_TO_VIEW));
    }
    next();
};

export const canCancelBooking = [
    requireBookingOwnerOrAdmin
];

export const canManageBooking = [
    requireBookingOwnerOrAdmin
];

export const canViewBooking = [
    requireBookingOwnerOrAdmin
];
