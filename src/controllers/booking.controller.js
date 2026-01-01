import Booking from "../models/booking.model.js";

export const createBooking = async (req, res, next) => {
  try {
    const { user_id, event_id, number_of_tickets, booking_date } = req.body;

    if (!user_id || !event_id || !number_of_tickets || !booking_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBooking = new Booking({
      user_id,
      event_id,
      number_of_tickets,
      booking_date
    });

    const savedBooking = await newBooking.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    next(error);
  }
};