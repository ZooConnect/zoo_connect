import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true }, // Who is booking?
    event_id: { type: String, required: true }, // What event?
    number_of_tickets: { type: Number, required: true, min: 1 },
    booking_date: { type: Date, required: true }, // When?
    status: { 
      type: String, 
      enum: ['confirmed', 'cancelled', 'pending'], 
      default: 'confirmed' 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);