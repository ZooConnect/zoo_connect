import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active'
    },
    // Historique pour audit
    reprogrammedFrom: {
      type: Date,
      default: null
    },
    reprogrammedTo: {
      type: Date,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    cancelReason: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// Index pour optimiser les requêtes
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ eventId: 1, status: 1 });
bookingSchema.index({ userId: 1, bookingDate: -1 });

// Instance methods
bookingSchema.methods.isActive = function () {
  return this.status === 'active';
};

bookingSchema.methods.isCancelled = function () {
  return this.status === 'cancelled';
};

// Query helpers
bookingSchema.query.byUser = function (userId) {
  return this.where({ userId });
};

bookingSchema.query.active = function () {
  return this.where({ status: 'active' });
};

bookingSchema.query.cancelled = function () {
  return this.where({ status: 'cancelled' });
};

const Booking = mongoose.model('Booking', bookingSchema, 'bookings');
export default Booking;
