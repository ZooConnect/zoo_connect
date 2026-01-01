import bookingRepo from "../repositories/booking.repository.js";

export const findBookingById = async (id) => bookingRepo.readBookingById(id);

export const findBookingsByUserId = async (userId, metadata = {}) => bookingRepo.readBookingsByUserId(userId, metadata);

export const findBookings = async () => bookingRepo.readBookings();

export const isBookingCancelled = (booking) => booking.isCancelled();

export const isBookingExisting = async (id) => bookingRepo.fastReadBookingById(id);

export const modifyBooking = async (id, updates) => bookingRepo.updateBooking(id, updates);

export const registerBooking = async (booking, metadata = {}) => bookingRepo.createBooking(booking, metadata);

export const removeBooking = async (id) => bookingRepo.deleteBooking(id);