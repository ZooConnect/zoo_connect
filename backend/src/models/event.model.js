import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
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
eventSchema.index({ startDate: 1, endDate: 1, status: 1, type: 1 });

// Mongoose Middleware: Pre-save validation
eventSchema.pre('save', function () {
  // Validate that endDate is after startDate
  if (this.endDate <= this.startDate) {
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
  return this.where({ endDate: { $gte: now } });
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
    startDate: { $lte: endOfDay },
    endDate: { $gte: startOfDay }
  });
};

eventSchema.query.past = function (now = new Date()) {
  return this.where({ endDate: { $lt: now } });
};

// Instance Methods: Methods available on individual documents
// ces méthodes sont utilisées dans le service et non dans le repo
// elles s'appliquent directement aux documents déjà chargé
eventSchema.methods.isActive = function () {
  return this.status === "active";
};

eventSchema.methods.isOngoing = function () {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
};

eventSchema.methods.isUpcoming = function () {
  const now = new Date();
  return now < this.startDate;
};

eventSchema.methods.isPast = function () {
  const now = new Date();
  return now > this.endDate;
};

const Event = mongoose.model("Event", eventSchema, "events");
export default Event;
