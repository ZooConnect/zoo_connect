// src/controllers/booking.controller.js
import Booking from '../models/booking.model.js';
import Event from '../models/event.model.js';

/**
 * GET /api/bookings - List user's bookings (active)
 */
export async function listUserBookings(req, res, next) {
  try {
    const userId = req.user?.id; // Assumes authentication middleware sets req.user
    if (!userId) {
      return res.status(401).json({ 
        error: true, 
        message: 'User not authenticated' 
      });
    }

    const bookings = await Booking.find({ 
      userId, 
      status: 'active' 
    })
      .populate('eventId', 'title start_date end_date type description')
      .sort({ bookingDate: -1 })
      .lean();

    return res.status(200).json(bookings);
  } catch (err) {
    console.error('Error in listUserBookings:', err);
    return next(err);
  }
}

/**
 * DELETE /api/bookings/:id - Cancel a booking
 */
export async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        error: true, 
        message: 'User not authenticated' 
      });
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        error: true, 
        message: 'Invalid booking ID format' 
      });
    }

    // Find booking and verify ownership
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ 
        error: true, 
        message: 'Booking not found' 
      });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ 
        error: true, 
        message: 'You do not have permission to cancel this booking' 
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        error: true, 
        message: 'Booking is already cancelled' 
      });
    }

    // Cancel the booking
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelReason = req.body?.reason || 'User requested cancellation';
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (err) {
    console.error('Error in cancelBooking:', err);
    return next(err);
  }
}

/**
 * PUT /api/bookings/:id - Reprogram booking to a different event/date
 */
export async function reprogramBooking(req, res, next) {
  try {
    const { id } = req.params;
    const { eventId, newDate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        error: true, 
        message: 'User not authenticated' 
      });
    }

    // Validate request body
    if (!eventId && !newDate) {
      return res.status(400).json({ 
        error: true, 
        message: 'Either eventId or newDate is required' 
      });
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        error: true, 
        message: 'Invalid booking ID format' 
      });
    }

    // Find booking and verify ownership
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ 
        error: true, 
        message: 'Booking not found' 
      });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ 
        error: true, 
        message: 'You do not have permission to reprogram this booking' 
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        error: true, 
        message: 'Cannot reprogram a cancelled booking' 
      });
    }

    // If changing event, verify new event exists and is available
    let newEvent = null;
    if (eventId) {
      if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
          error: true, 
          message: 'Invalid event ID format' 
        });
      }

      newEvent = await Event.findById(eventId);
      if (!newEvent) {
        return res.status(404).json({ 
          error: true, 
          message: 'Event not found' 
        });
      }

      // Verify event is active and in future
      if (newEvent.status !== 'active') {
        return res.status(400).json({ 
          error: true, 
          message: 'Target event is not active' 
        });
      }

      if (newEvent.end_date < new Date()) {
        return res.status(400).json({ 
          error: true, 
          message: 'Target event is in the past' 
        });
      }

      // Store old event for audit
      booking.reprogrammedFrom = booking.eventId;
      booking.eventId = eventId;
    }

    // If changing date
    if (newDate) {
      const parsedDate = new Date(newDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ 
          error: true, 
          message: 'Invalid date format' 
        });
      }

      if (parsedDate < new Date()) {
        return res.status(400).json({ 
          error: true, 
          message: 'Cannot reprogram to a past date' 
        });
      }

      booking.reprogrammedTo = parsedDate;
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking reprogrammed successfully',
      booking: await booking.populate('eventId', 'title start_date end_date type')
    });
  } catch (err) {
    console.error('Error in reprogramBooking:', err);
    return next(err);
  }
}

/**
 * GET /api/bookings/:id - Get single booking details
 */
export async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        error: true, 
        message: 'User not authenticated' 
      });
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        error: true, 
        message: 'Invalid booking ID format' 
      });
    }

    const booking = await Booking.findById(id).populate('eventId');
    if (!booking) {
      return res.status(404).json({ 
        error: true, 
        message: 'Booking not found' 
      });
    }

    // Verify ownership
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ 
        error: true, 
        message: 'You do not have permission to view this booking' 
      });
    }

    return res.status(200).json(booking);
  } catch (err) {
    console.error('Error in getBookingById:', err);
    return next(err);
  }
}
