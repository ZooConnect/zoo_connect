import mongoose from 'mongoose';

const feedingScheduleSchema = new mongoose.Schema({
    animal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feeding_time: { type: String, required: true }, // Format "HH:mm"
    food_type: { type: String, required: true },
    frequency: { type: String, default: "Quotidien" },
    notes: { type: String },
}, { timestamps: true });

export default mongoose.model('FeedingSchedule', feedingScheduleSchema);