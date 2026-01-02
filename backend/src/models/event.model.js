import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ['feeding', 'show', 'workshop', 'tour', 'special', 'conservation'],
      lowercase: true
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

// Indexes for optimized queries
eventSchema.index({ start_date: 1, end_date: 1, status: 1, type: 1 });

// Mongoose Middleware: Pre-save validation
eventSchema.pre('save', function () {
  // Validate that end_date is after start_date
  if (this.end_date <= this.start_date) {
    const err = new Error('endDate must be after startDate');
    err.name = 'ValidationError';
    throw err;
  }
});

// Query Helpers: Reusable query methods
eventSchema.query.active = function () {
  return this.where({ status: 'active' });
};

eventSchema.query.upcomingFrom = function (now = new Date()) {
  return this.where({ end_date: { $gte: now } });
};

eventSchema.query.byType = function (type) {
  return this.where({ type: type.toLowerCase() });
};

eventSchema.query.onDate = function (date) {
  const day = new Date(date);
  const startOfDay = new Date(day);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(day);
  endOfDay.setHours(23, 59, 59, 999);

  return this.where({
    start_date: { $lte: endOfDay },
    end_date: { $gte: startOfDay }
  });
};

eventSchema.query.past = function (now = new Date()) {
  return this.where({ end_date: { $lt: now } });
};

// Instance Methods: Methods available on individual documents
// ces méthodes sont utilisées dans le service et non dans le repo
// elles s'appliquent directement aux documents déjà chargé
eventSchema.methods.isActive = function () {
  return this.status === "active";
};

eventSchema.methods.isOngoing = function () {
  const now = new Date();
  return now >= this.start_date && now <= this.end_date;
};

eventSchema.methods.isUpcoming = function () {
  const now = new Date();
  return now < this.start_date;
};

eventSchema.methods.isPast = function () {
  const now = new Date();
  return now > this.end_date;
};

const Event = mongoose.model("Event", eventSchema, "events");
export default Event;
