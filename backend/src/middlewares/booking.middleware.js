import * as bookingService from "../services/booking.service.js";


export const findBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.id;

        const booking = await bookingService.findBooking(bookingId);

        req.booking = booking;
        next();
    } catch (error) {
        return next(error);
    }
};

export const requireBookingOwnerOrAdmin = (req, res, next) => {
    const booking = req.booking;
    const user = req.user;

    bookingService.requireBookingOwnerOrAdmin(booking, user);

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
