import Booking from "../models/booking.model.js";

const createBooking = async (dto) => Booking.create(dto);

const fastReadBookingById = async (id) => Booking.exists(id);

const readBookingById = async (id) => {
    return Booking.findById(id)
        .populate("userId")
        .populate("eventId")
        .lean();
}

const readBookings = async () => {
    return Booking.find()
        .populate("userId")
        .populate("eventId")
        .lean();
}

const readBookingsByUserId = async (userId, metadata = {}) => {
    return Booking.find({ userId, ...metadata })
        .populate("userId")
        .populate("eventId")
        .sort({ bookingDate: -1 })
        .lean();
}

const updateBooking = async (id, updates) => {
    return Booking.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        timestamps: true
    });
}

export const deleteBooking = async (bookingId) => Booking.findByIdAndDelete(bookingId);

export default {
    createBooking,
    fastReadBookingById,
    readBookingById,
    readBookings,
    readBookingsByUserId,
    updateBooking,
    deleteBooking
}