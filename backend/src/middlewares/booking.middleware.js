import * as bookingService from "../services/booking.service.js";

import { respond } from "../utils/response.helper.js";

import MESSAGES from "../constants/messages.js";

export const findBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const booking = await bookingService.findBookingById(bookingId);
        if (!booking) return respond(res, MESSAGES.BOOKING.NOT_FOUND);

        req.booking = booking;
        next();
    } catch (error) {
        return res.status(401).json({ error });
    }
};